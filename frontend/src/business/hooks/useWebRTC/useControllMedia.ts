import { useEffect } from 'react';

import { useMediaInfo } from '@stores/zustandStores/useMediaInfo';

import WebRTC from './WebRTC';
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

  const {
    dataChannels,
    replacePeerconnectionAudioTrack2NowLocalStream,
    replacePeerconnectionVideoTrack2NowLocalStream,
    setLocalStream,
  } = WebRTC.getInstace();

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

    const mediaInfoChannel = dataChannels.get('mediaInfoChannel');
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

    const mediaInfoChannel = dataChannels.get('mediaInfoChannel');
    if (!mediaInfoChannel || mediaInfoChannel.readyState !== 'open') {
      return;
    }

    const audioTrackenabled = audioTrack.getAudioTracks()[0].enabled;
    mediaInfoChannel.send(JSON.stringify([{ type: 'audio', onOrOff: audioTrackenabled }]));
  };

  const changeMyVideoTrack = async () => {
    const stream = await getLocalStream({ cameraID: selectedCameraID });

    setLocalVideoSrcObj(stream);
    setLocalStream(stream);
    replacePeerconnectionVideoTrack2NowLocalStream();
  };

  const changeMyAudioTrack = async (id?: string) => {
    const stream = await getLocalStream({ audioID: id });

    setLocalVideoSrcObj(stream);
    setLocalStream(stream);
    replacePeerconnectionAudioTrack2NowLocalStream();
  };

  // TODO mediaInfoChannel 변경되었을 떄 로직을 WebRTC 클래스로 옮기기.
  useEffect(() => {
    const mediaInfoChannel = dataChannels.get('mediaInfoChannel');
    if (!mediaInfoChannel) return;

    mediaInfoChannel.addEventListener('open', () => {
      const audioTrack = localVideoRef.current?.srcObject as MediaStream;
      const videoTrack = localVideoRef.current?.srcObject as MediaStream;

      mediaInfoChannel?.send(JSON.stringify([{ type: 'audio', onOrOff: audioTrack.getAudioTracks()[0].enabled }]));
      mediaInfoChannel?.send(JSON.stringify([{ type: 'video', onOrOff: videoTrack.getVideoTracks()[0].enabled }]));
    });
  }, []);

  return { changeMyVideoTrack, changeMyAudioTrack, toggleVideo, toggleAudio };
}
