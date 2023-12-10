import WebRTC from '@business/services/WebRTC';

import { ERROR_MESSAGE } from '@constants/messages';

import { HumanSocketManager } from './SocketManager';

const webRTC = WebRTC.getInstace();

const socketManager = new HumanSocketManager();

interface initSignalingSocketParams {
  roomName: string;
  onExitUser: () => void;
}
export const initSignalingSocket = ({ roomName, onExitUser }: initSignalingSocketParams) => {
  socketManager.on('welcome', async (users: { id: string }[]) => {
    if (users.length === 0) {
      return;
    }
    const sdp = await webRTC.createOffer();
    await webRTC.setLocalDescription(sdp);
    socketManager.emit('offer', sdp, roomName);
  });

  socketManager.on('offer', async (sdp: RTCSessionDescription) => {
    await webRTC.setRemoteDescription(sdp);
    const answerSdp = await webRTC.createAnswer();
    webRTC.setLocalDescription(answerSdp);
    socketManager.emit('answer', answerSdp, roomName);
  });

  socketManager.on('answer', async (sdp: RTCSessionDescription) => {
    await webRTC.setRemoteDescription(sdp);
  });

  socketManager.on('candidate', async (candidate: RTCIceCandidate) => {
    await webRTC.addIceCandidate(candidate);
  });

  socketManager.on('roomFull', () => {
    alert(ERROR_MESSAGE.FULL_ROOM);
  });

  socketManager.on('userExit', async () => {
    console.log('userExit');
    onExitUser();
  });
};
