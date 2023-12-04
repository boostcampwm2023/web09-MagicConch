import { useEffect } from 'react';

export default function useVolumeAnalyser(videoRef: React.RefObject<HTMLVideoElement>) {
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
    };

    function calculateAverageVolume(array: Uint8Array) {
      const sum = array.reduce((acc, value) => acc + value, 0);
      return Math.floor(Math.min(sum, 70));
    }
  }, [videoRef.current]);
}
