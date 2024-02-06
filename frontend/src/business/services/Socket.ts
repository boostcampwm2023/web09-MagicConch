import { WebRTC } from '.';

import { ERROR_MESSAGE } from '@constants/messages';

import { HumanSocketManager } from './SocketManager';

interface initSignalingSocketParams {
  roomName: string;
  onExitUser: () => void;
}

export const initSignalingSocket = ({ roomName, onExitUser }: initSignalingSocketParams) => {
  const webRTC = WebRTC.getInstance(HumanSocketManager.getInstance());
  const socketManager = HumanSocketManager.getInstance();

  socketManager.on('welcome', async (users: { id: string }[]) => {
    await sendCreatedOffer(users, roomName);
  });

  socketManager.on('offer', async (sdp: RTCSessionDescription) => {
    await sendCreatedAnswer(sdp, roomName);
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
    onExitUser();
  });
};

export async function sendCreatedOffer(users: { id: string }[], roomName: string) {
  if (users.length === 0) {
    return;
  }
  const webRTC = WebRTC.getInstance();
  const socketManager = HumanSocketManager.getInstance();

  const sdp = await webRTC.createOffer();

  await webRTC.setLocalDescription(sdp);

  socketManager.emit('offer', sdp, roomName);
}

export async function sendCreatedAnswer(sdp: RTCSessionDescription, roomName: string) {
  const webRTC = WebRTC.getInstance();
  const socketManager = HumanSocketManager.getInstance();

  await webRTC.setRemoteDescription(sdp);

  const answerSdp = await webRTC.createAnswer();

  webRTC.setLocalDescription(answerSdp);

  socketManager.emit('answer', answerSdp, roomName);
}
