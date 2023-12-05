import { useMemo } from 'react';

import { ProfileInfo } from '@stores/zustandStores/useProfileInfo';

import { arrayBuffer2Blob } from '@utils/array';

import { Icon } from '@iconify/react/dist/iconify.js';

interface CamBoxProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  defaultImage: 'bg-ddung' | 'bg-sponge';
  profileInfo?: ProfileInfo;
  cameraConnected?: boolean;
  nickname?: string;
  defaultNickname: string;
  audioConnected?: boolean;
}

const CamBox = ({
  videoRef,
  defaultImage,
  cameraConnected,
  audioConnected,
  profileInfo,
  nickname,
  defaultNickname,
}: CamBoxProps) => {
  const loading = useMemo(() => !videoRef.current?.srcObject, [videoRef.current?.srcObject]);
  const hidden = useMemo(() => !cameraConnected, [cameraConnected]);

  const bgImage = useMemo(() => {
    if (!profileInfo) {
      return undefined;
    }
    const { arrayBuffer, type } = profileInfo;

    const blob = arrayBuffer2Blob(arrayBuffer, type);
    return URL.createObjectURL(blob);
  }, [profileInfo]);

  return (
    <>
      <div className="flex relative w-320 h-320 rounded-[55px] overflow-hidden shadow-white">
        {loading && <div className="absolute skeleton w-h-full"></div>}
        {hidden && (bgImage ? <img src={bgImage} /> : <div className={`absolute w-h-full ${defaultImage} bg-cover`} />)}
        <video
          className="flex-1 w-h-full max-w-full"
          ref={videoRef}
          autoPlay
          playsInline
        />
        <div className="w-full absolute bottom-0 left-0 p-30 flex justify-between gap-30  text-white">
          <div className="flex gap-5">
            <Icon
              icon={`${cameraConnected ? 'pepicons-pop:camera' : 'pepicons-pop:camera-off'}`}
              className={`rounded-full w-40 h-40 p-8 ${cameraConnected ? 'surface-point-alt' : 'surface-disabled'}`}
            />
            <Icon
              icon={`${audioConnected ? 'mingcute:mic-line' : 'mingcute:mic-off-line'}`}
              className={`rounded-full w-40 h-40 p-8 ${audioConnected ? 'surface-point-alt' : 'surface-disabled'}`}
            />
          </div>
          <div className="flex-1 flex-with-center rounded-full w-40 h-40 p-8 surface-disabled">
            {nickname ?? defaultNickname}
          </div>
        </div>
      </div>
    </>
  );
};

export default CamBox;
