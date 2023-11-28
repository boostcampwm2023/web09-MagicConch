import { useEffect } from 'react';

import { useControllMedia } from './useControllMedia';
import { useDataChannel } from './useDataChannel';
import { useMedia } from './useMedia';
import { useMediaInfoContext } from './useMediaInfoContext';
import { useRTCPeerConnection } from './useRTCPeerConnection';
import { useSignalingSocket } from './useSignalingSocket';
import { useSocket } from './useSocket';

export function useWebRTC(roomName: string) {
  const { socketEmit } = useSocket('WebRTC');

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
  const { mediaInfoChannel, chatChannel, initDataChannels, closeDataChannels } = useDataChannel({
    peerConnectionRef,
  });

  const { addTracks, changeMyAudioTrack, changeMyVideoTrack, toggleAudio, toggleVideo } = useControllMedia({
    localStreamRef,
    peerConnectionRef,
    localVideoRef,
    mediaInfoChannel,
    getMedia,
  });

  const negotiationDataChannels = () => {
    closeRTCPeerConnection();
    closeDataChannels();
    makeRTCPeerConnection();
    initDataChannels();
    addTracks();
  };

  const { initSignalingSocket } = useSignalingSocket({
    roomName,
    peerConnectionRef,
    negotiationDataChannels,
  });

  useEffect(() => {
    const initOnMount = async () => {
      await getMedia({});
      initSignalingSocket();
      makeRTCPeerConnection();
      initDataChannels();
      addTracks();
      socketEmit('joinRoom', roomName);
    };

    initOnMount();

    return () => {
      closeRTCPeerConnection();
      closeDataChannels();
      disconnectSocket();
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
