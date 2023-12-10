import WebRTC from '../../services/WebRTC';

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
    selectedCameraID,
    toggleMyMic: toggleMyMicState,
    toggleMyVideo: toggleMyVideoState,
  } = useMediaInfo(state => ({
    toggleMyVideo: state.toggleMyVideo,
    toggleMyMic: state.toggleMyMic,
    setSelectedAudioID: state.setSelectedAudioID,
    setSelectedCameraID: state.setSelectedCameraID,
    selectedAudioID: state.selectedAudioID,
    selectedCameraID: state.selectedCameraID,
  }));

  const { getLocalStream } = useMedia();

  const webRTC = WebRTC.getInstace();

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

    const mediaInfoChannel = webRTC.dataChannels.get('mediaInfoChannel');
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

    const mediaInfoChannel = webRTC.dataChannels.get('mediaInfoChannel');
    if (!mediaInfoChannel || mediaInfoChannel.readyState !== 'open') {
      return;
    }

    const audioTrackenabled = audioTrack.getAudioTracks()[0].enabled;
    mediaInfoChannel.send(JSON.stringify([{ type: 'audio', onOrOff: audioTrackenabled }]));
  };

  const changeMyVideoTrack = async () => {
    const stream = await getLocalStream({ cameraID: selectedCameraID });

    setLocalVideoSrcObj(stream);
    webRTC.setLocalStream(stream);
    webRTC.replacePeerconnectionVideoTrack2NowLocalStream();
  };

  const changeMyAudioTrack = async (id?: string) => {
    const stream = await getLocalStream({ audioID: id });

    setLocalVideoSrcObj(stream);
    webRTC.setLocalStream(stream);
    webRTC.replacePeerconnectionAudioTrack2NowLocalStream();
  };

  return { changeMyVideoTrack, changeMyAudioTrack, toggleVideo, toggleAudio };
}
