import WebRTC from '@business/hooks/useWebRTC/WebRTC';

import { ERROR_MESSAGE } from '@constants/messages';

import { HumanSocketManager } from './SocketManager';

const { addIceCandidate, createOffer, createAnswer, setLocalDescription, setRemoteDescription } = WebRTC.getInstace();

const socketManager = new HumanSocketManager();

interface initSignalingSocketParams {
  roomName: string;
  onNegotiationDataChannels: () => void;
}
export const initSignalingSocket = ({ roomName, onNegotiationDataChannels }: initSignalingSocketParams) => {
  socketManager.on('welcome', async (users: { id: string }[]) => {
    if (users.length === 0) {
      return;
    }
    const sdp = await createOffer();
    await setLocalDescription(sdp);
    socketManager.emit('offer', sdp, roomName);
  });

  socketManager.on('offer', async (sdp: RTCSessionDescription) => {
    await setRemoteDescription(sdp);
    const answerSdp = await createAnswer();
    setLocalDescription(answerSdp);
    socketManager.emit('answer', answerSdp, roomName);
  });

  socketManager.on('answer', async (sdp: RTCSessionDescription) => {
    await setRemoteDescription(sdp);
  });

  socketManager.on('candidate', async (candidate: RTCIceCandidate) => {
    await addIceCandidate(candidate);
  });

  socketManager.on('roomFull', () => {
    alert(ERROR_MESSAGE.FULL_ROOM);
  });

  socketManager.on('userExit', async () => {
    onNegotiationDataChannels();
  });
};
