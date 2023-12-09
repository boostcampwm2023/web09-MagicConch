import { useRef, useState } from 'react';

import { useMediaInfo } from '@stores/zustandStores/useMediaInfo';

export function useMedia() {
  const { myMicOn, myVideoOn, selectedAudioID, selectedCameraID } = useMediaInfo(state => ({
    selectedAudioID: state.selectedAudioID,
    selectedCameraID: state.selectedCameraID,
    myMicOn: state.myMicOn,
    myVideoOn: state.myVideoOn,
  }));

  const [cameraOptions, setCameraOptions] = useState<MediaDeviceInfo[]>([]);
  const [audioOptions, setAudioOptions] = useState<MediaDeviceInfo[]>([]);

  const localStreamRef = useRef<MediaStream>();
  const remoteStreamRef = useRef<MediaStream>();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const getCamerasOptions = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');
    setCameraOptions(cameras);
  };

  const getAudiosOptions = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audios = devices.filter(device => device.kind === 'audioinput');
    setAudioOptions(audios);
  };

  // TODO: 아래 함수도 읽기 쉽게 리팩토링 해야함, 현재는 무슨 뜻인지 나도 모르겠음
  const getMedia = async ({ audioID, cameraID }: { cameraID?: string; audioID?: string }) => {
    const _audioID = audioID || selectedAudioID;
    const _cameraID = cameraID || selectedCameraID;

    const audioOptions = {
      withAudioId: { deviceId: _audioID },
      default: true,
    };
    const videoOptions = {
      withCameraId: { deviceId: _cameraID, width: 320, height: 320 },
      default: { facingMode: 'user', width: 320, height: 320 },
    };

    const audioOption = _audioID ? audioOptions.withAudioId : audioOptions.default;
    const videoOption = _cameraID ? videoOptions.withCameraId : videoOptions.default;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: audioOption,
      video: videoOption,
    });

    if (!myVideoOn) {
      stream.getVideoTracks().forEach(track => (track.enabled = false));
    }
    if (!myMicOn) {
      stream.getAudioTracks().forEach(track => (track.enabled = false));
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      localStreamRef.current = stream;
    }

    if (!selectedAudioID) {
      await getCamerasOptions();
    }
    if (!selectedCameraID) {
      await getAudiosOptions();
    }
  };

  return {
    cameraOptions,
    audioOptions,
    localVideoRef,
    remoteVideoRef,
    localStreamRef,
    remoteStreamRef,

    getMedia,
    getAudiosOptions,
    getCamerasOptions,
  };
}
