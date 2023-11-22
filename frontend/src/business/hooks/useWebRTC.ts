import { useEffect, useRef } from 'react';

import { disconnectSocket, socketEmit } from '@business/services/socket';

import { iceServers } from '@constants/urls';

import { useMedia } from './useMedia';
import { useSignalingSocket } from './useSignalingSocket';

export function useWebRTC(roomName: string) {
  const peerConnectionRef = useRef<RTCPeerConnection>();

  const {
    localVideoRef,
    remoteVideoRef,
    cameraOptions,
    localStreamRef,
    toggleVideo,
    toggleAudio,
    changeCamera,
    getMedia,
  } = useMedia();

  const { initSignalingSocket, closePeerConnection } = useSignalingSocket({ roomName, peerConnectionRef });

  const makeConnection = () => {
    if (localStreamRef.current === undefined) {
      return;
    }

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

    localStreamRef.current.getTracks().forEach(track => {
      peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
    });
  };

  useEffect(() => {
    const init = async () => {
      await getMedia();
      initSignalingSocket();
      makeConnection();
      socketEmit('join_room', roomName);
    };
    init();

    return () => {
      disconnectSocket();
      closePeerConnection();
    };
  }, []);

  return {
    cameraOptions,
    localVideoRef,
    remoteVideoRef,
    toggleAudio,
    toggleVideo,
    changeCamera,
  };
}
