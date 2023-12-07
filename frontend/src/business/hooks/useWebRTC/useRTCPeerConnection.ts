import { useEffect, useRef } from 'react';

import { HumanSocketManager } from '@business/services/SocketManager';

import { iceServers } from '@constants/urls';

interface useRTCPeerConnectionParams {
  remoteVideoRef: React.RefObject<HTMLVideoElement | undefined>;
}

export function useRTCPeerConnection({ remoteVideoRef }: useRTCPeerConnectionParams) {
  const peerConnectionRef = useRef<RTCPeerConnection>();
  const peerStreamRef = useRef<MediaStream | null>(null);

  const socketManager = new HumanSocketManager();

  const prodIceServerConfig = [
    {
      urls: `${import.meta.env.VITE_WAS_URL}/turn`,
      credential: import.meta.env.VITE_ICE_SERVER_CREDENTIAL,
      username: import.meta.env.VITE_ICER_SERVER_USERNAME,
    },
  ];
  const devIceServerConfig = [{ urls: iceServers }];

  const makeRTCPeerConnection = async ({ roomName }: { roomName: string }) => {
    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: import.meta.env.MODE === 'development' ? devIceServerConfig : devIceServerConfig,
    });

    peerConnectionRef.current.addEventListener('track', e => {
      peerStreamRef.current = e.streams[0];
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
    if (!remoteVideoRef.current) {
      return;
    }

    remoteVideoRef.current.srcObject = peerStreamRef.current;
  }, [remoteVideoRef.current]);

  return { makeRTCPeerConnection, closeRTCPeerConnection, peerConnectionRef, isConnectedPeerConnection };
}
