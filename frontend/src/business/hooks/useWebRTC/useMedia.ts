import { useRef } from 'react';

import { getUserMediaStream } from '@business/services/Media';

import { useMediaInfo } from '@stores/zustandStores/useMediaInfo';

import WebRTC from './WebRTC';

export function useMedia() {
  const { myMicOn, myVideoOn, selectedAudioID, selectedCameraID } = useMediaInfo(state => ({
    selectedAudioID: state.selectedAudioID,
    selectedCameraID: state.selectedCameraID,
    myMicOn: state.myMicOn,
    myVideoOn: state.myVideoOn,
  }));

  const webRTC = WebRTC.getInstace();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const setLocalVideoWithLocalStream = (stream: MediaStream) => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      webRTC.setLocalStream(stream);
    }
  };

  const getMedia = async ({ audioID, cameraID }: { cameraID?: string; audioID?: string } = {}) => {
    const nowSelectedAudioID = audioID || selectedAudioID;
    const nowSelectedCameraID = cameraID || selectedCameraID;

    const audioOptions = {
      withAudioID: { deviceId: nowSelectedAudioID },
      withoutAudioID: true,
    };
    const videoOptions = {
      withCameraID: { deviceId: nowSelectedCameraID, width: 320, height: 320 },
      withoutCameraID: { facingMode: 'user', width: 320, height: 320 },
    };

    const audio = nowSelectedAudioID ? audioOptions.withAudioID : audioOptions.withoutAudioID;
    const video = nowSelectedCameraID ? videoOptions.withCameraID : videoOptions.withoutCameraID;

    const stream = await getUserMediaStream({ audio, video });

    if (!myVideoOn) {
      stream.getVideoTracks().forEach(track => (track.enabled = false));
    }
    if (!myMicOn) {
      stream.getAudioTracks().forEach(track => (track.enabled = false));
    }

    setLocalVideoWithLocalStream(stream);
  };

  return {
    localVideoRef,
    remoteVideoRef,
    getMedia,
  };
}
