import { Icon } from '@iconify/react/dist/iconify.js';

interface CamBoxProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  defaultImage: 'bg-ddung' | 'bg-sponge';
  cameraConnected?: boolean;
  audioConnected?: boolean;
}

const CamBox = ({ videoRef, defaultImage, cameraConnected, audioConnected }: CamBoxProps) => {
  return (
    <>
      <div className="flex relative w-320 h-320">
        <video
          className={`flex-1 rounded-[55px] w-320 h-320 first-letter:max-w-full ${!cameraConnected && defaultImage}`}
          ref={videoRef}
          autoPlay
          playsInline
        />
        <div className="absolute bottom-0 left-0 p-30 flex gap-5  text-white">
          <Icon
            icon="pepicons-pop:camera"
            className={`rounded-full w-40 h-40 p-8 ${cameraConnected ? 'bg-black' : 'bg-gray-300'}`}
          />
          <Icon
            icon="mingcute:mic-off-line"
            className={`rounded-full w-40 h-40 p-8 ${audioConnected ? 'bg-black' : 'bg-gray-300'}`}
          />
        </div>
      </div>
    </>
  );
};

export default CamBox;
