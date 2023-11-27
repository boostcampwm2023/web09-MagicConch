import { useEffect, useRef, useState } from 'react';

import { iceServers } from '@constants/urls';

import { useMedia } from './useMedia';
import { useSignalingSocket } from './useSignalingSocket';
import { useSocket } from './useSocket';

export function useWebRTC(roomName: string) {
  const peerConnectionRef = useRef<RTCPeerConnection>();
  const { socketEmit, disconnectSocket } = useSocket('WebRTC');
  const [cameraConnected, setCameraConnected] = useState({ local: false, remote: false });

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
      setCameraConnected(prev => ({ ...prev, remote: true }));
    });
  };

  const addTracks = () => {
    if (localStreamRef.current === undefined) {
      return;
    }
    localStreamRef.current.getTracks().forEach(track => {
      peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
    });
  };

  const changeVideoTrack = () => {
    const nowTrack = localStreamRef.current?.getVideoTracks()[0];
    const sender = peerConnectionRef.current?.getSenders().find(sender => sender.track?.kind === 'video');
    sender?.replaceTrack(nowTrack!);
  };

  const changeAudioTrack = () => {
    const nowTrack = localStreamRef.current?.getAudioTracks()[0];
    const sender = peerConnectionRef.current?.getSenders().find(sender => sender.track?.kind === 'audio');
    sender?.replaceTrack(nowTrack!);
  };

  useEffect(() => {
    const init = async () => {
      await getMedia();
      setCameraConnected(prev => ({ ...prev, local: true }));
      initSignalingSocket();
      makeConnection();
      addTracks();
      socketEmit('joinRoom', roomName);
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
    cameraConnected,
    toggleAudio,
    toggleVideo,
    changeCamera,
    addTracks,
    changeVideoTrack,
    changeAudioTrack,
  };
}
