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

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: _audioID ? { deviceId: _audioID } : true,
      video: _cameraID
        ? { deviceId: _cameraID, width: 320, height: 320 }
        : { facingMode: 'user', width: 320, height: 320 },
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
