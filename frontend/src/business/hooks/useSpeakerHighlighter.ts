import { useEffect, useRef } from 'react';

import { calculateAverage } from '@utils/unit8Array';

const FFT_SIZE = 32;
const INTERVAL_TIME = 100;
const SHADOW_COLOR = '#0052F0';
const MAX_SHADOW_LENGTH = 70;
const THERESHSHOLD = 60;
const MAX_VOLUME = 255;

export default function useSpeakerHighlighter(videoRef: React.RefObject<HTMLVideoElement>) {
  const interval = useRef<NodeJS.Timeout>();

  const deleteInterval = () => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = undefined;
    }
  };

  useEffect(() => {
    deleteInterval();

    if (!videoRef.current || !('captureStream' in HTMLVideoElement.prototype)) {
      return;
    }

    const videoElement = videoRef.current as any;
    const stream = videoElement.captureStream();

    stream.onactive = () => {
      if (stream.getAudioTracks().length === 0) return;

      const audioContext = new window.AudioContext();

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = FFT_SIZE;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      let prevVolume = 0;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      deleteInterval();
      interval.current = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const curVolume = calculateAverage(dataArray);
        animateHighLight(videoElement, prevVolume, curVolume);

        prevVolume = curVolume;
      }, INTERVAL_TIME);
    };

    return deleteInterval;
  }, [videoRef.current]);
}

function animateHighLight(videoElement: HTMLVideoElement, startVolume: number, endVolume: number) {
  const frames = [
    { filter: `drop-shadow(0px 0px ${getShadowLength(startVolume)}px ${SHADOW_COLOR}` },
    { filter: `drop-shadow(0px 0px ${getShadowLength(endVolume)}px ${SHADOW_COLOR}` },
  ];
  const options: KeyframeAnimationOptions = {
    duration: INTERVAL_TIME,
    fill: 'forwards',
  };
  videoElement.animate(frames, options);
}

function getShadowLength(volume: number) {
  const thresholdedVolume = Math.max(volume - THERESHSHOLD, 0);
  return (thresholdedVolume / (MAX_VOLUME - THERESHSHOLD)) * MAX_SHADOW_LENGTH;
}
