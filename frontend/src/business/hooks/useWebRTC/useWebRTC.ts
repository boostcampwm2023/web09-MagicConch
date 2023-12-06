import { useEffect } from 'react';

import { useControllMedia } from './useControllMedia';
import { useDataChannel } from './useDataChannel';
import { useMedia } from './useMedia';
import { useRTCPeerConnection } from './useRTCPeerConnection';
import { useSignalingSocket } from './useSignalingSocket';

export default function useWebRTC() {
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

  const { peerConnectionRef, makeRTCPeerConnection, closeRTCPeerConnection, isConnectedPeerConnection } =
    useRTCPeerConnection({ remoteVideoRef });

  const { mediaInfoChannel, chatChannel, initDataChannels, closeDataChannels, profileChannel, nicknameChannel } =
    useDataChannel({
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
    if (isConnectedPeerConnection()) {
      return;
    }
    await getMedia({});
    initSignalingSocket({ roomName });
    makeRTCPeerConnection({ roomName });
    initDataChannels();
    addTracks();
  };

  const endWebRTC = () => {
    if (isConnectedPeerConnection()) {
      closeRTCPeerConnection();
      closeDataChannels();
    }
  };

  useEffect(() => {
    return () => {
      endWebRTC();
    };
  }, []);

  return {
    cameraOptions,
    audioOptions,
    localVideoRef,
    remoteVideoRef,
    mediaInfoChannel,
    chatChannel,
    profileChannel,
    nicknameChannel,
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
    isConnectedPeerConnection,
  };
}
