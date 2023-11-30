import { CustomButton, IconToggleButton } from '@components/Buttons';
import CamBox from '@components/CamBox';

import { Icon } from '@iconify/react/dist/iconify.js';

interface CamContainerProps {
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  toggleVideo: () => void;
  toggleAudio: () => void;
  cameraConnected: { local: boolean; remote: boolean };
  audioConnected: { local: boolean; remote: boolean };
  tarotButtonClick: () => void;
  tarotButtonDisabled: boolean;
}

export default function CamContainer({
  localVideoRef,
  remoteVideoRef,
  toggleVideo,
  toggleAudio,
  cameraConnected,
  audioConnected,
  tarotButtonClick,
  tarotButtonDisabled,
}: CamContainerProps) {
  return (
    <div className="flex-with-center flex-col gap-80 pt-80">
      <div className="flex justify-center gap-64 h-320">
        <CamBox
          videoRef={localVideoRef}
          cameraConnected={cameraConnected.local}
          audioConnected={audioConnected.local}
          defaultImage="bg-ddung"
        />
        <CamBox
          videoRef={remoteVideoRef}
          cameraConnected={cameraConnected.remote}
          audioConnected={audioConnected.remote}
          defaultImage="bg-sponge"
        />
      </div>
      <div className="flex flex-col gap-30">
        <CustomButton
          size="m"
          onClick={tarotButtonClick}
          disabled={tarotButtonDisabled}
          color={tarotButtonDisabled ? 'disabled' : 'active'}
        >
          <Icon
            width="17"
            height="17"
            icon="tabler:cards-filled"
          />
          타로 카드 펼치기
        </CustomButton>
        <div className="flex-with-center gap-48">
          <IconToggleButton
            activeIcon="pepicons-pop:camera"
            disabledIcon="pepicons-pop:camera-off"
            iconSize={28}
            buttonSize="l"
            active={cameraConnected.local}
            onClick={toggleVideo}
          />
          <IconToggleButton
            activeIcon="mingcute:mic-line"
            disabledIcon="mingcute:mic-off-line"
            iconSize={28}
            buttonSize="l"
            active={cameraConnected.local}
            onClick={toggleAudio}
          />
        </div>
      </div>
    </div>
  );
}
