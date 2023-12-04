import { useEffect } from 'react';

import { calculateAverage } from '@utils/unit8Array';

export default function useSpeakerHighlighter(videoRef: React.RefObject<HTMLVideoElement>) {
  useEffect(() => {
    if (!videoRef.current || !('captureStream' in HTMLVideoElement.prototype)) {
      return;
    }
    const videoElement = videoRef.current as any;

    const audioContext = new window.AudioContext();
    const stream = videoElement.captureStream();

    stream.onactive = () => {
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);

      detectSpreaker(videoElement, analyser);
    };
  }, [videoRef.current]);
}

function detectSpreaker(videoElement: HTMLVideoElement, analyser: AnalyserNode) {
  analyser.fftSize = 1024;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  let prevVolume = 0;

  setInterval(() => {
    analyser.getByteFrequencyData(dataArray);
    const curVolume = Math.min(calculateAverage(dataArray), 70);

    animateHighLight(videoElement, prevVolume, curVolume);
    prevVolume = curVolume;
  }, 100);
}

function animateHighLight(videoElement: HTMLVideoElement, startLength: number, endLength: number) {
  const frames = [
    { filter: `drop-shadow(0px 0px ${startLength}px #0052F0` },
    { filter: `drop-shadow(0px 0px ${endLength}px #0052F0` },
  ];
  const options: KeyframeAnimationOptions = {
    duration: 200,
    fill: 'forwards',
  };
  videoElement.animate(frames, options);
}
