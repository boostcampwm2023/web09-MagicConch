import WebRTC from '@business/services/WebRTC';

import { useMediaInfo } from '@stores/zustandStores/useMediaInfo';

import { useMedia } from './useMedia';

interface useContorollMediaParams {
  localVideoRef: React.RefObject<HTMLVideoElement | undefined>;
}

const toggleTrack = (track: MediaStreamTrack) => {
  track.enabled = !track.enabled;
};

export function useControllMedia({ localVideoRef }: useContorollMediaParams) {
  const {
    toggleMyMic: toggleMyMicState,
    toggleMyVideo: toggleMyVideoState,
    setSelectedAudioID,
    setSelectedCameraID,
  } = useMediaInfo(state => ({
    toggleMyVideo: state.toggleMyVideo,
    toggleMyMic: state.toggleMyMic,
    setSelectedAudioID: state.setSelectedAudioID,
    setSelectedCameraID: state.setSelectedCameraID,
    selectedAudioID: state.selectedAudioID,
    selectedCameraID: state.selectedCameraID,
  }));

  const { getLocalStream } = useMedia();

  const webRTC = WebRTC.getInstance();

  const setLocalVideoSrcObj = (stream: MediaStream) => {
    if (!localVideoRef.current) {
      return;
    }
    localVideoRef.current.srcObject = stream;
  };

  const toggleVideo = () => {
    if (!localVideoRef.current) {
      return;
    }

    const videoTrack = localVideoRef.current.srcObject as MediaStream;
    videoTrack.getVideoTracks().forEach(toggleTrack);
    toggleMyVideoState();

    const mediaInfoChannel = webRTC.getDataChannels().get('mediaInfoChannel');
    if (!mediaInfoChannel || mediaInfoChannel.readyState !== 'open') {
      return;
    }

    const videoTrackenabled = videoTrack.getVideoTracks()[0].enabled;
    mediaInfoChannel.send(JSON.stringify([{ type: 'video', onOrOff: videoTrackenabled }]));
  };

  const toggleAudio = () => {
    if (!localVideoRef.current) {
      return;
    }

    const audioTrack = localVideoRef.current.srcObject as MediaStream;
    audioTrack.getAudioTracks().forEach(toggleTrack);
    toggleMyMicState();

    const mediaInfoChannel = webRTC.getDataChannels().get('mediaInfoChannel');
    if (!mediaInfoChannel || mediaInfoChannel.readyState !== 'open') {
      return;
    }

    const audioTrackenabled = audioTrack.getAudioTracks()[0].enabled;
    mediaInfoChannel.send(JSON.stringify([{ type: 'audio', onOrOff: audioTrackenabled }]));
  };

  const changeMyVideoTrack = async (id?: string) => {
    const stream = await getLocalStream({ cameraID: id });

    if (id) {
      setSelectedCameraID(id);
    }
    setLocalVideoSrcObj(stream);
    webRTC.setLocalStream(stream);
    webRTC.replacePeerconnectionVideoTrack2NowLocalStream();
  };

  const changeMyAudioTrack = async (id?: string) => {
    const stream = await getLocalStream({ audioID: id });

    if (id) {
      setSelectedAudioID(id);
    }
    setLocalVideoSrcObj(stream);
    webRTC.setLocalStream(stream);
    webRTC.replacePeerconnectionAudioTrack2NowLocalStream();
  };

  return { changeMyVideoTrack, changeMyAudioTrack, toggleVideo, toggleAudio };
}
