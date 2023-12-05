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
      <div className="flex relative w-320 h-320 sm:w-[30vh] sm:h-[30vh] rounded-[55px] sm:rounded-[50px]  overflow-hidden shadow-white">
        <video
          className={`flex-1 w-h-full min-w-full min-h-full`}
          ref={videoRef}
          autoPlay
          playsInline
        />
        {loading && <div className="absolute skeleton w-h-full"></div>}
        {hidden && <div className={`absolute w-h-full ${defaultImage} bg-cover`} />}
        <div className="absolute bottom-0 left-0 p-30 flex gap-5 text-white sm:p-20">
          <Icon
            icon={`${cameraConnected ? 'pepicons-pop:camera' : 'pepicons-pop:camera-off'}`}
            className={`rounded-full w-40 h-40 sm:w-30 sm:h-30 p-8 sm:p-4 ${
              cameraConnected ? 'surface-point-alt' : 'surface-disabled'
            }`}
          />
          <Icon
            icon={`${audioConnected ? 'mingcute:mic-line' : 'mingcute:mic-off-line'}`}
            className={`rounded-full w-40 h-40 sm:w-30 sm:h-30 p-8 sm:p-4 ${
              audioConnected ? 'surface-point-alt' : 'surface-disabled'
            }`}
          />
        </div>
      </div>
    </>
  );
};

export default CamBox;
