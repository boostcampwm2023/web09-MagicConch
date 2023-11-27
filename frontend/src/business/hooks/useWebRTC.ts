import { useEffect } from 'react';

import { useControllMedia } from './useControllMedia';
import { useDataChannel } from './useDataChannel';
import { useMedia } from './useMedia';
import { useRTCPeerConnection } from './useRTCPeerConnection';
import { useSignalingSocket } from './useSignalingSocket';
import { useSocket } from './useSocket';

interface useWebRTCProps {
  roomName: string;
}

export function useWebRTC({ roomName }: useWebRTCProps) {
  const { socketEmit, disconnectSocket } = useSocket('WebRTC');

  const { localVideoRef, remoteVideoRef, cameraOptions, localStreamRef, getMedia } = useMedia();

  const { peerConnectionRef, makeRTCPeerConnection, closeRTCPeerConnection } = useRTCPeerConnection({
    roomName,
    remoteVideoRef,
  });

  const { initSignalingSocket } = useSignalingSocket({ roomName, peerConnectionRef });

  const { mediaInfoChannel, chatChannel, initDataChannels } = useDataChannel({
    peerConnectionRef,
  });

  const { addTracks, changeAudioTrack, changeVideoTrack, toggleAudio, toggleVideo } = useControllMedia({
    localStreamRef,
    peerConnectionRef,
    localVideoRef,
    mediaInfoChannel,
  });

  useEffect(() => {
    const init = async () => {
      await getMedia();
      initSignalingSocket();
      makeRTCPeerConnection();
      initDataChannels();
      addTracks();
      socketEmit('joinRoom', roomName);
    };
    init();

    return () => {
      disconnectSocket();
      closeRTCPeerConnection();
    };
  }, []);

  return {
    cameraOptions,
    localVideoRef,
    remoteVideoRef,
    toggleAudio,
    toggleVideo,
    addTracks,
    changeVideoTrack,
    changeAudioTrack,
    changeCamera: getMedia,
    mediaInfoChannel,
    chatChannel,
  };
}
