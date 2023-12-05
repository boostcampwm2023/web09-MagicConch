import { useEffect, useRef } from 'react';

import { HumanSocketManager } from '@business/services/SocketManager';

import { iceServers } from '@constants/urls';

interface useRTCPeerConnectionProps {
  remoteVideoRef: React.RefObject<HTMLVideoElement | undefined>;
}

export function useRTCPeerConnection({ remoteVideoRef }: useRTCPeerConnectionProps) {
  const peerConnectionRef = useRef<RTCPeerConnection>();
  const peerStreamRef = useRef<MediaStream | null>(null);

  const socketManager = new HumanSocketManager();

  const makeRTCPeerConnection = async ({ roomName }: { roomName: string }) => {
    peerConnectionRef.current = new RTCPeerConnection({ iceServers: [{ urls: iceServers }] });

    peerConnectionRef.current.addEventListener('track', e => {
      if (!remoteVideoRef.current) {
        return;
      }

      remoteVideoRef.current.srcObject = e.streams[0];
      peerStreamRef.current = e.streams[0];
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
