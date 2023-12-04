import { useEffect } from 'react';

import { HumanSocketManager } from '@business/services/SocketManager';

import { useControllMedia } from './useControllMedia';
import { useDataChannel } from './useDataChannel';
import { useMedia } from './useMedia';
import { useMediaInfoContext } from './useMediaInfoContext';
import { useRTCPeerConnection } from './useRTCPeerConnection';
import { useSignalingSocket } from './useSignalingSocket';

export function useWebRTC() {
  const socketManager = new HumanSocketManager();

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

  const { peerConnectionRef, makeRTCPeerConnection, closeRTCPeerConnection, isConnectedPeerConnection } =
    useRTCPeerConnection({ remoteVideoRef });

  const { mediaInfoChannel, chatChannel, initDataChannels, closeDataChannels } = useDataChannel({ peerConnectionRef });

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
    if (socketManager.connected) {
      closeRTCPeerConnection();
      closeDataChannels();
    }
  };

  useEffect(() => {
    socketManager.connect();

    return () => {
      endWebRTC();
      socketManager.disconnect();
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
    isConnectedPeerConnection,
    socketConnected: socketManager.connected,
  };
}
