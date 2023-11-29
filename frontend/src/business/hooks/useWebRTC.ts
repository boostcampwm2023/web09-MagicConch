import { useControllMedia } from './useControllMedia';
import { useDataChannel } from './useDataChannel';
import { useMedia } from './useMedia';
import { useMediaInfoContext } from './useMediaInfoContext';
import { useRTCPeerConnection } from './useRTCPeerConnection';
import { useSignalingSocket } from './useSignalingSocket';
import { useSocket } from './useSocket';

export function useWebRTC() {
  const { socketEmit, disconnectSocket, isSocketConnected } = useSocket('WebRTC');

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

  const { initSignalingSocket } = useSignalingSocket({
    peerConnectionRef,
    negotiationDataChannels,
  });

  const startWebRTC = async ({ roomName, password }: { roomName: string; password: string }) => {
    await getMedia({});
    initSignalingSocket({ roomName });
    makeRTCPeerConnection({ roomName });
    initDataChannels();
    addTracks();

    if (password) {
    } else {
      socketEmit('joinRoom', roomName);
    }
  };

  const endWebRTC = () => {
    if (isSocketConnected()) {
      closeRTCPeerConnection();
      closeDataChannels();
      disconnectSocket();
    }
  };

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
  };
}
