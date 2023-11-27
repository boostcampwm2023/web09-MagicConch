import { useEffect } from 'react';

import { useControllMedia } from './useControllMedia';
import { useMedia } from './useMedia';
import { useRTCPeerConnection } from './useRTCPeerConnection';
import { useSignalingSocket } from './useSignalingSocket';
import { useSocket } from './useSocket';

export function useWebRTC(roomName: string) {
  const { socketEmit, disconnectSocket } = useSocket('WebRTC');

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

  const { peerConnectionRef, makeConnection, closeConnection } = useRTCPeerConnection({ roomName, remoteVideoRef });

  const { initSignalingSocket } = useSignalingSocket({ roomName, peerConnectionRef });

  const { addTracks, changeAudioTrack, changeVideoTrack } = useControllMedia({ localStreamRef, peerConnectionRef });

  useEffect(() => {
    const init = async () => {
      await getMedia();
      initSignalingSocket();
      makeConnection();
      addTracks();
      socketEmit('joinRoom', roomName);
    };
    init();

    return () => {
      disconnectSocket();
      closeConnection();
    };
  }, []);

  return {
    cameraOptions,
    localVideoRef,
    remoteVideoRef,
    toggleAudio,
    toggleVideo,
    changeCamera,
    addTracks,
    changeVideoTrack,
    changeAudioTrack,
  };
}
