import { useEffect, useState } from 'react';

import { getMediaDeviceOptions } from '@business/services/Media';

export function useMediaOptinos() {
  const [mediaOptions, setMediaOptions] = useState<{
    audio: { label: string; value: string }[];
    video: { label: string; value: string }[];
  }>({
    audio: [],
    video: [],
  });

  const changeMediaOptions = async () => {
    const { audiosOptions, cameraOptions } = await getMediaDeviceOptions();

    setMediaOptions({
      audio: audiosOptions.map(({ deviceId, label }) => ({ label, value: deviceId })),
      video: cameraOptions.map(({ deviceId, label }) => ({ label, value: deviceId })),
    });
  };

  useEffect(() => {
    changeMediaOptions();
  }, []);

  return { mediaOptions };
}
