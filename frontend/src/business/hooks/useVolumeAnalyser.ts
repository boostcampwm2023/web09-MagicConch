import { useEffect } from 'react';

export default function useVolumeAnalyser(videoRef: React.RefObject<HTMLVideoElement>) {
  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    const audioContext = new window.AudioContext();
    const stream = videoRef.current.srcObject as MediaStream;

    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    source.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let prevVolume = 0;

    setInterval(() => {
      analyser.getByteFrequencyData(dataArray);

      const averageVolume = calculateAverageVolume(dataArray);

      videoRef.current!.animate(
        [
          { filter: `drop-shadow(0px 0px ${prevVolume}px #0052F0` },
          { filter: `drop-shadow(0px 0px ${averageVolume}px #0052F0` },
        ],
        {
          duration: 200,
          fill: 'forwards',
        },
      );
      prevVolume = averageVolume;
      console.log('Average Volume:', averageVolume);
    }, 500);

    function calculateAverageVolume(array: Uint8Array) {
      const sum = array.reduce((acc, value) => acc + value, 0);

      const max = Math.max(sum / array.length - 30, 0);
      const result = Math.min(max, 70);

      return Math.floor(result);
    }
  }, [videoRef.current]);
}
