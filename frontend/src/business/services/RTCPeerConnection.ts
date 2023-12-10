import WebRTC from '@business/hooks/useWebRTC/WebRTC';

import { HumanSocketManager } from './SocketManager';

const socketManager = new HumanSocketManager();

const { addRTCPeerConnectionEventListener, connectRTCPeerConnection, setRemoteStream } = WebRTC.getInstace();

export const makeRTCPeerConnection = (roomName: string) => {
  connectRTCPeerConnection();

  addRTCPeerConnectionEventListener('track', e => {
    setRemoteStream(e.streams[0]);
  });

  addRTCPeerConnectionEventListener('icecandidate', e => {
    if (!e.candidate) {
      return;
    }

    socketManager.emit('candidate', e.candidate, roomName);
  });
};
