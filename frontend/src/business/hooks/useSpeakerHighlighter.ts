import { useEffect, useRef } from 'react';

import { calculateAverage } from '@utils/unit8Array';

const FFT_SIZE = 32;
const INTERVAL_TIME = 100;
const SHADOW_COLOR = '#0052F0';
const MAX_SHADOW_LENGTH = 70;

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

function animateHighLight(videoElement: HTMLVideoElement, startLength: number, endLength: number) {
  const frames = [
    { filter: `drop-shadow(0px 0px ${Math.min(startLength, MAX_SHADOW_LENGTH)}px ${SHADOW_COLOR}` },
    { filter: `drop-shadow(0px 0px ${Math.min(endLength, MAX_SHADOW_LENGTH)}px ${SHADOW_COLOR}` },
  ];
  const options: KeyframeAnimationOptions = {
    duration: INTERVAL_TIME,
    fill: 'forwards',
  };
  videoElement.animate(frames, options);
}
