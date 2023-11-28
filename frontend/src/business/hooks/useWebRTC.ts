import { useEffect } from 'react';

import { useControllMedia } from './useControllMedia';
import { useDataChannel } from './useDataChannel';
import { useMedia } from './useMedia';
import { useMediaInfoContext } from './useMediaInfoContext';
import { useRTCPeerConnection } from './useRTCPeerConnection';
import { useSignalingSocket } from './useSignalingSocket';
import { useSocket } from './useSocket';

interface useWebRTCProps {
  roomName: string;
}

export function useWebRTC({ roomName }: useWebRTCProps) {
  const { socketEmit, disconnectSocket } = useSocket('WebRTC');

  const { mediaInfos } = useMediaInfoContext();

  const {
    localVideoRef,
    remoteVideoRef,
    localStreamRef,
    cameraOptions,
    audioOptions,
    getMedia,
    getAudiosOptions,
    getCamerasOptions,
  } = useMedia();

  const { peerConnectionRef, makeRTCPeerConnection, closeRTCPeerConnection } = useRTCPeerConnection({
    roomName,
    remoteVideoRef,
  });

  const { initSignalingSocket } = useSignalingSocket({ roomName, peerConnectionRef });

  const { mediaInfoChannel, chatChannel, initDataChannels } = useDataChannel({
    peerConnectionRef,
  });

  const { addTracks, changeMyAudioTrack, changeMyVideoTrack, toggleAudio, toggleVideo } = useControllMedia({
    localStreamRef,
    peerConnectionRef,
    localVideoRef,
    mediaInfoChannel,
    getMedia,
  });

  useEffect(() => {
    const init = async () => {
      await getMedia({});
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
    audioOptions,
    localVideoRef,
    remoteVideoRef,
    mediaInfoChannel,
    chatChannel,
    mediaInfos,
    toggleAudio,
    toggleVideo,
    addTracks,
    changeMyAudioTrack,
    changeMyVideoTrack,
    getAudiosOptions,
    getCamerasOptions,
    getMedia,
  };
}
