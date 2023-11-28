import { useRef, useState } from 'react';

import { useMediaInfoContext } from './useMediaInfoContext';

export function useMedia() {
  const {
    mediaInfos: { selectedAudioID, selectedCameraID },
  } = useMediaInfoContext();

  const [cameraOptions, setCameraOptions] = useState<MediaDeviceInfo[]>([]);
  const [audioOptions, setAudioOptions] = useState<MediaDeviceInfo[]>([]);

  const localStreamRef = useRef<MediaStream>();

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

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: _audioID ? audioOptions.withAudioId : audioOptions.default,
      video: _cameraID ? videoOptions.withCameraId : videoOptions.default,
    });

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
    getMedia,
    getAudiosOptions,
    getCamerasOptions,
  };
}
