import { useEffect, useRef } from 'react';

import { HumanSocketManager } from '@business/services/SocketManager';

import { iceServers } from '@constants/urls';

interface useRTCPeerConnectionParams {
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  remoteStreamRef: React.MutableRefObject<MediaStream | undefined>;
}

export function useRTCPeerConnection({ remoteVideoRef, remoteStreamRef }: useRTCPeerConnectionParams) {
  const peerConnectionRef = useRef<RTCPeerConnection>();

  const socketManager = new HumanSocketManager();

  const devIceServerConfig = [{ urls: iceServers }];

  const makeRTCPeerConnection = async ({ roomName }: { roomName: string }) => {
    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: import.meta.env.MODE === 'development' ? devIceServerConfig : devIceServerConfig,
    });

    peerConnectionRef.current.addEventListener('track', e => {
      remoteStreamRef.current = e.streams[0];
      if (!remoteVideoRef.current) {
        return;
      }

      remoteVideoRef.current.srcObject = e.streams[0];
    });

    peerConnectionRef.current.addEventListener('icecandidate', e => {
      if (!e.candidate) {
        return;
      }

      socketManager.emit('candidate', e.candidate, roomName);
    });
  };

  const closeRTCPeerConnection = () => {
    peerConnectionRef.current?.close();
  };

  const isConnectedPeerConnection = () => {
    return peerConnectionRef.current?.iceConnectionState === 'connected';
  };

  useEffect(() => {
    if (!remoteVideoRef.current || !remoteStreamRef.current) {
      return;
    }

    remoteVideoRef.current.srcObject = remoteStreamRef.current;
  }, [remoteVideoRef.current]);

  return { makeRTCPeerConnection, closeRTCPeerConnection, peerConnectionRef, isConnectedPeerConnection };
}
