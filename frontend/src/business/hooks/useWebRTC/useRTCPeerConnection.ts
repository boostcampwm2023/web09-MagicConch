import { useEffect } from 'react';

import { HumanSocketManager } from '@business/services/SocketManager';

import WebRTC from './WebRTC';

interface useRTCPeerConnectionParams {
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
}

export function useRTCPeerConnection({ remoteVideoRef }: useRTCPeerConnectionParams) {
  const socketManager = new HumanSocketManager();

  const webRTC = WebRTC.getInstace();

  const makeRTCPeerConnection = async ({ roomName }: { roomName: string }) => {
    webRTC.connectRTCPeerConnection();

    webRTC.addRTCPeerConnectionEventListener('track', e => {
      webRTC.setRemoteStream(e.streams[0]);
      if (!remoteVideoRef.current) {
        return;
      }

      remoteVideoRef.current.srcObject = e.streams[0];
    });

    webRTC.addRTCPeerConnectionEventListener('icecandidate', e => {
      if (!e.candidate) {
        return;
      }

      socketManager.emit('candidate', e.candidate, roomName);
    });
  };

  useEffect(() => {
    if (!remoteVideoRef.current || !webRTC.remoteStream) {
      return;
    }

    remoteVideoRef.current.srcObject = webRTC.remoteStream;
  }, [remoteVideoRef.current]);

  return { makeRTCPeerConnection };
}
