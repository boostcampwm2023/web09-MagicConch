import { useEffect, useRef } from 'react';

import { HumanSocketManager } from '@business/services/SocketManager';

import WebRTC from './WebRTC';

interface useRTCPeerConnectionParams {
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
}

export function useRTCPeerConnection({ remoteVideoRef }: useRTCPeerConnectionParams) {
  const socketManager = new HumanSocketManager();
  const remoteStreamRef = useRef<MediaStream>();

  const { addRTCPeerConnectionEventListener, connectRTCPeerConnection, setRemoteStream, remoteStream } =
    WebRTC.getInstace();

  const makeRTCPeerConnection = ({ roomName }: { roomName: string }) => {
    connectRTCPeerConnection();

    addRTCPeerConnectionEventListener('track', e => {
      setRemoteStream(e.streams[0]);
      console.log(remoteVideoRef.current, remoteVideoRef);

      if (!remoteVideoRef.current) {
        return;
      }

      remoteVideoRef.current.srcObject = e.streams[0];
    });

    addRTCPeerConnectionEventListener('icecandidate', e => {
      if (!e.candidate) {
        return;
      }

      socketManager.emit('candidate', e.candidate, roomName);
    });
  };

  useEffect(() => {
    if (!remoteVideoRef.current || !remoteStreamRef.current) {
      return;
    }
    console.log('chanred');

    remoteVideoRef.current.srcObject = remoteStreamRef.current;
  }, [remoteVideoRef]);

  return { makeRTCPeerConnection };
}
