import { WebRTC } from '.';

import { ERROR_MESSAGE } from '@constants/messages';

import { HumanSocketManager } from './SocketManager';

interface WebRTCConnectionSetupParams {
  description?: RTCSessionDescription;
  candidate?: RTCIceCandidate;
}

interface initSignalingSocketParams {
  roomName: string;
  onExitUser?: () => void;
}

export const initSignalingSocket = ({ roomName, onExitUser }: initSignalingSocketParams) => {
  const socketManager = HumanSocketManager.getInstance();

  // 최초 접속 시, welcome 이벤트를 받고 offer를 생성하여 상대방에게 보냄
  socketManager.on('welcome', async () => sendCreatedSDP(roomName, 'answer'));

  socketManager.on('connection', async (params: WebRTCConnectionSetupParams) => {
    await handleWebRTCConnectionSetup({ ...params, roomName });
  });

  socketManager.on('roomFull', () => {
    alert(ERROR_MESSAGE.FULL_ROOM);
  });

  socketManager.on('userExit', async () => {
    onExitUser?.();
  });
};

export async function sendCreatedSDP(roomName: string, type: 'offer' | 'answer') {
  const webRTC = WebRTC.getInstance(HumanSocketManager.getInstance());
  const socketManager = HumanSocketManager.getInstance();

  const sdp = type === 'offer' ? await webRTC.createOffer() : await webRTC.createAnswer();
  await webRTC.setLocalDescription(sdp);

  const description = webRTC.getPeerConnection()?.localDescription;
  socketManager.emit('connection', { roomName, description });
}

export async function handleWebRTCConnectionSetup({
  description,
  candidate,
  roomName,
}: { roomName: string } & WebRTCConnectionSetupParams) {
  const webRTC = WebRTC.getInstance(HumanSocketManager.getInstance());

  // offer & answer를 주고받는 과정
  if (description) {
    await webRTC.setRemoteDescription(description);

    // 상대방이 보낸 offer에 대해 answer를 생성하고, 이를 다시 상대방에게 보냄
    if (description.type === 'offer') {
      sendCreatedSDP(roomName, 'answer');
    }
  }
  // 위의 과정이 끝나고 ice candidate를 주고받는 과정
  else if (candidate) {
    await webRTC.addIceCandidate(candidate);
  }
}
