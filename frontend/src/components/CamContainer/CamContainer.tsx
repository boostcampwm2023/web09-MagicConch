import { IconButton, IconToggleButton } from '@components/Buttons';
import CamBox from '@components/CamBox';

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
    <div className="flex-with-center flex-col gap-80 pt-80 sm:gap-20">
      <div className="flex justify-center gap-64 sm:flex-col sm:gap-20">
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
      <div className="flex flex-col gap-30 z-10">
        <IconButton
          icon="tabler:cards-filled"
          onClick={tarotButtonClick}
          disabled={tarotButtonDisabled}
        >
          타로 카드 펼치기
        </IconButton>
        <div className="flex-with-center gap-48">
          <IconToggleButton
            activeIcon="pepicons-pop:camera"
            inactiveIcon="pepicons-pop:camera-off"
            size="l"
            active={cameraConnected.local}
            onClick={toggleVideo}
          />
          <IconToggleButton
            activeIcon="mingcute:mic-line"
            inactiveIcon="mingcute:mic-off-line"
            size="l"
            active={audioConnected.local}
            onClick={toggleAudio}
          />
        </div>
      </div>
    </div>
  );
}
