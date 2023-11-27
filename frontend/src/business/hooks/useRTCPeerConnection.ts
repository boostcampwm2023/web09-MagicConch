import { useRef } from 'react';

import { iceServers } from '@constants/urls';

import { useSocket } from './useSocket';

interface useRTCPeerConnectionProps {
  roomName: string;
  remoteVideoRef: React.RefObject<HTMLVideoElement | undefined>;
}

export function useRTCPeerConnection({ roomName, remoteVideoRef }: useRTCPeerConnectionProps) {
  const peerConnectionRef = useRef<RTCPeerConnection>();

  const { socketEmit } = useSocket('WebRTC');

  const makeConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection({ iceServers: [{ urls: iceServers }] });

    peerConnectionRef.current.addEventListener('track', e => {
      if (!remoteVideoRef.current) {
        return;
      }

      remoteVideoRef.current.srcObject = e.streams[0];
    });

    peerConnectionRef.current.addEventListener('icecandidate', e => {
      if (!e.candidate) {
        return;
      }

      socketEmit('candidate', e.candidate, roomName);
    });
  };

  const closeConnection = () => {
    peerConnectionRef.current?.close();
  };

  return { makeConnection, closeConnection, peerConnectionRef };
}
