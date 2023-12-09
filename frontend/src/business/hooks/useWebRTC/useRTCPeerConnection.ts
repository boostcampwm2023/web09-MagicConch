import { useEffect, useRef } from 'react';

import { HumanSocketManager } from '@business/services/SocketManager';

import { iceServers } from '@constants/urls';

import WebRTC from './WebRTC';

interface useRTCPeerConnectionParams {
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
}

export function useRTCPeerConnection({ remoteVideoRef }: useRTCPeerConnectionParams) {
  const peerConnectionRef = useRef<RTCPeerConnection>();

  const socketManager = new HumanSocketManager();

  const devIceServerConfig = [{ urls: iceServers }];

  const webRTC = WebRTC.getInstace();

  const makeRTCPeerConnection = async ({ roomName }: { roomName: string }) => {
    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: import.meta.env.MODE === 'development' ? devIceServerConfig : devIceServerConfig,
    });

    peerConnectionRef.current.addEventListener('track', e => {
      webRTC.setRemoteStream(e.streams[0]);
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
    if (!remoteVideoRef.current || !webRTC.remoteStream) {
      return;
    }

    remoteVideoRef.current.srcObject = webRTC.remoteStream;
  }, [remoteVideoRef.current]);

  return { makeRTCPeerConnection, closeRTCPeerConnection, peerConnectionRef, isConnectedPeerConnection };
}
