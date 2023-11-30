import { useEffect } from 'react';

import { useControllMedia } from './useControllMedia';
import { useDataChannel } from './useDataChannel';
import { useMedia } from './useMedia';
import { useMediaInfoContext } from './useMediaInfoContext';
import { useRTCPeerConnection } from './useRTCPeerConnection';
import { useSignalingSocket } from './useSignalingSocket';
import { useSocket } from './useSocket';

export function useWebRTC() {
  const { isSocketConnected, disconnectSocket, connectSocket } = useSocket('WebRTC');

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

  const negotiationDataChannels = ({ roomName }: { roomName: string }) => {
    closeRTCPeerConnection();
    closeDataChannels();
    makeRTCPeerConnection({ roomName });
    initDataChannels();
    addTracks();
  };

  const { initSignalingSocket, createRoom, joinRoom } = useSignalingSocket({
    peerConnectionRef,
    negotiationDataChannels,
  });

  const startWebRTC = async ({ roomName }: { roomName: string }) => {
    await getMedia({});
    initSignalingSocket({ roomName });
    makeRTCPeerConnection({ roomName });
    initDataChannels();
    addTracks();
  };

  const endWebRTC = () => {
    if (isSocketConnected()) {
      closeRTCPeerConnection();
      closeDataChannels();
    }
  };

  useEffect(() => {
    if (!isSocketConnected()) {
      connectSocket(import.meta.env.VITE_HUMAN_SOCKET_URL);
    }

    return () => {
      endWebRTC();
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
    startWebRTC,
    endWebRTC,
    createRoom,
    joinRoom,
  };
}
