import { useEffect } from 'react';

import WebRTC from './WebRTC';
import { useControllMedia } from './useControllMedia';
import { useDataChannel } from './useDataChannel';
import { useMedia } from './useMedia';
import { useRTCPeerConnection } from './useRTCPeerConnection';
import { useSignalingSocket } from './useSignalingSocket';

export default function useWebRTC() {
  const webRTC = WebRTC.getInstace();

  const { localVideoRef, remoteVideoRef, getMedia } = useMedia();

  const { makeRTCPeerConnection } = useRTCPeerConnection({ remoteVideoRef });

  const { initDataChannels } = useDataChannel({});

  const { addTracks, changeMyAudioTrack, changeMyVideoTrack, toggleAudio, toggleVideo } = useControllMedia({
    localVideoRef,
    getMedia,
  });

  const negotiationDataChannels = ({ roomName }: { roomName: string }) => {
    webRTC.closeRTCPeerConnection();
    closeDataChannels();
    makeRTCPeerConnection({ roomName });
    initDataChannels();
    addTracks();
  };

  const { initSignalingSocket, createRoom, joinRoom, checkRoomExist } = useSignalingSocket({
    negotiationDataChannels,
  });

  const startWebRTC = async ({ roomName }: { roomName: string }) => {
    if (webRTC.isConnectedPeerConnection()) {
      return;
    }
    await getMedia({});
    initSignalingSocket({ roomName });
    makeRTCPeerConnection({ roomName });
    initDataChannels();
    addTracks();
  };

  const endWebRTC = () => {
    if (webRTC.isConnectedPeerConnection()) {
      webRTC.closeRTCPeerConnection();
      closeDataChannels();
    }
  };

  useEffect(() => {
    return () => {
      endWebRTC();
    };
  }, []);

  return {
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
    getMedia,
    startWebRTC,
    endWebRTC,
    createRoom,
    joinRoom,
    checkRoomExist,
  };
}
