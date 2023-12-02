import { useMemo } from 'react';

import { Icon } from '@iconify/react/dist/iconify.js';

interface CamBoxProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  defaultImage: 'bg-ddung' | 'bg-sponge';
  cameraConnected?: boolean;
  audioConnected?: boolean;
}

const CamBox = ({ videoRef, defaultImage, cameraConnected, audioConnected }: CamBoxProps) => {
  const loading = useMemo(() => !videoRef.current?.srcObject, [videoRef.current?.srcObject]);
  const hidden = useMemo(() => !cameraConnected, [cameraConnected]);

  return (
    <>
      <div className="flex relative w-320 h-320 rounded-[55px] overflow-hidden shadow-white">
        {loading && <div className="absolute skeleton w-h-full"></div>}
        {hidden && <div className={`absolute w-h-full ${defaultImage} bg-cover`} />}
        <video
          className="flex-1 w-h-full max-w-full"
          ref={videoRef}
          autoPlay
          playsInline
        />
        <div className="absolute bottom-0 left-0 p-30 flex gap-5  text-white">
          <Icon
            icon={`${cameraConnected ? 'pepicons-pop:camera' : 'pepicons-pop:camera-off'}`}
            className={`rounded-full w-40 h-40 p-8 ${cameraConnected ? 'surface-point-alt' : 'surface-disabled'}`}
          />
          <Icon
            icon={`${audioConnected ? 'mingcute:mic-line' : 'mingcute:mic-off-line'}`}
            className={`rounded-full w-40 h-40 p-8 ${audioConnected ? 'surface-point-alt' : 'surface-disabled'}`}
          />
        </div>
      </div>
    </>
  );
};

export default CamBox;
