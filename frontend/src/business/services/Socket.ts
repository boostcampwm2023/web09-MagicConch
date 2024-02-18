import { WebRTC } from '.';

import { ERROR_MESSAGE } from '@constants/messages';

import { HumanSocketManager } from './SocketManager';

interface initSignalingSocketParams {
  roomName: string;
  onExitUser?: () => void;
}

export const initSignalingSocket = ({ roomName, onExitUser }: initSignalingSocketParams) => {
  const webRTC = WebRTC.getInstance(HumanSocketManager.getInstance());
  const socketManager = HumanSocketManager.getInstance();

  // 최초 접속 시, welcome 이벤트를 받고 offer를 생성하여 상대방에게 보냄
  socketManager.on('welcome', async () => {
    await webRTC.setLocalDescription(await webRTC.createOffer());
    socketManager.emit('connection', { roomName, description: webRTC.getPeerConnection()?.localDescription });
  });

  socketManager.on(
    'connection',
    async ({ description, candidate }: { description?: RTCSessionDescription; candidate?: RTCIceCandidate }) => {
      // offer & answer를 주고받는 과정
      if (description) {
        await webRTC.setRemoteDescription(description);

        // 상대방이 보낸 offer에 대해 answer를 생성하고, 이를 다시 상대방에게 보냄
        if (description.type === 'offer') {
          await webRTC.setLocalDescription(await webRTC.createAnswer());
          socketManager.emit('connection', { roomName, description: webRTC.getPeerConnection()?.localDescription });
        }
      }
      // 위의 과정이 끝나고 ice candidate를 주고받는 과정
      else if (candidate) {
        await webRTC.addIceCandidate(candidate);
      }
    },
  );

  socketManager.on('roomFull', () => {
    alert(ERROR_MESSAGE.FULL_ROOM);
  });

  socketManager.on('userExit', async () => {
    onExitUser?.();
  });
};
