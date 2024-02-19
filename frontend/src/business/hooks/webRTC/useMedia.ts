import { getUserMediaStream } from '@business/services/Media';

import { useMediaInfo } from '@stores/zustandStores';

export function useMedia() {
  const { selectedAudioID, selectedCameraID } = useMediaInfo(state => ({
    selectedAudioID: state.selectedAudioID,
    selectedCameraID: state.selectedCameraID,
  }));

  const getVideoStream = async ({ cameraID }: { cameraID?: string } = {}) => {
    const nowSelectedCameraID = cameraID ?? selectedCameraID;

    const videoOptions = {
      withCameraID: { deviceId: nowSelectedCameraID, width: 320, height: 320 },
      default: { facingMode: 'user', width: 320, height: 320 },
    };

    const video = nowSelectedCameraID ? videoOptions.withCameraID : videoOptions.default;

    const stream = await getUserMediaStream({ video });

    return stream;
  };

  const getAudioStream = async ({ audioID }: { audioID?: string } = {}) => {
    const nowSelectedAudioID = audioID || selectedAudioID;

    const audioOptions = {
      withAudioID: { deviceId: nowSelectedAudioID },
      default: true,
    };

    const audio = nowSelectedAudioID ? audioOptions.withAudioID : audioOptions.default;

    const stream = await getUserMediaStream({ audio });

    return stream;
  };

  return {
    getVideoStream,
    getAudioStream,
  };
}
