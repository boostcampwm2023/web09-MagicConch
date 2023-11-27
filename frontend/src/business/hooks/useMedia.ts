import { useRef, useState } from 'react';

export function useMedia() {
  const [cameraOptions, setCameraOptions] = useState<MediaDeviceInfo[]>([]);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const localStreamRef = useRef<MediaStream>();

  const getCameras = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');
    setCameraOptions(cameras);
  };

  const getMedia = async (deviceId?: string) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: deviceId ? { deviceId, width: 320, height: 320 } : { facingMode: 'user', width: 320, height: 320 },
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      localStreamRef.current = stream;
    }

    if (!deviceId) {
      await getCameras();
    }
  };
  const changeCamera = async (cameraId: string) => {
    await getMedia(cameraId);
  };

  return {
    cameraOptions,
    localVideoRef,
    remoteVideoRef,
    localStreamRef,
    getMedia,
    changeCamera,
  };
}
