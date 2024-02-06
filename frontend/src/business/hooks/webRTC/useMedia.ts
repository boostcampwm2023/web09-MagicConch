import { getUserMediaStream } from '@business/services/Media';

import { useMediaInfo } from '@stores/zustandStores';

export function useMedia() {
  const { myMicOn, myVideoOn, selectedAudioID, selectedCameraID } = useMediaInfo(state => ({
    selectedAudioID: state.selectedAudioID,
    selectedCameraID: state.selectedCameraID,
    myMicOn: state.myMicOn,
    myVideoOn: state.myVideoOn,
  }));

  const getLocalStream = async ({ audioID, cameraID }: { cameraID?: string; audioID?: string } = {}) => {
    const nowSelectedAudioID = audioID || selectedAudioID;
    const nowSelectedCameraID = cameraID || selectedCameraID;

    const audioOptions = {
      withAudioID: { deviceId: nowSelectedAudioID },
      default: true,
    };
    const videoOptions = {
      withCameraID: { deviceId: nowSelectedCameraID, width: 320, height: 320 },
      default: { facingMode: 'user', width: 320, height: 320 },
    };

    const audio = nowSelectedAudioID ? audioOptions.withAudioID : audioOptions.default;
    const video = nowSelectedCameraID ? videoOptions.withCameraID : videoOptions.default;

    const stream = await getUserMediaStream({ audio, video });

    if (!myVideoOn) {
      stream.getVideoTracks().forEach(track => (track.enabled = false));
    }
    if (!myMicOn) {
      stream.getAudioTracks().forEach(track => (track.enabled = false));
    }
    return stream;
  };

  return {
    getLocalStream,
  };
}
