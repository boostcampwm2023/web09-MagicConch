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
      video: deviceId ? { deviceId } : { facingMode: 'user' },
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      localStreamRef.current = stream;
    }

    if (!deviceId) {
      await getCameras();
    }
  };

  const toggleVideo = () => {
    if (!localVideoRef.current) {
      return;
    }

    const videoTrack = localVideoRef.current.srcObject as MediaStream;
    videoTrack.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
  };

  const toggleAudio = () => {
    if (!localVideoRef.current) {
      return;
    }

    const audioTrack = localVideoRef.current.srcObject as MediaStream;
    audioTrack.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
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
    toggleAudio,
    toggleVideo,
    changeCamera,
  };
}
