import { IconToggleButton } from '@components/Buttons';
import CamBox from '@components/CamBox';

interface CamContainerProps {
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  toggleVideo: () => void;
  toggleAudio: () => void;
  cameraConnected: { local: boolean; remote: boolean };
}

export default function CamContainer({
  localVideoRef,
  remoteVideoRef,
  toggleVideo,
  toggleAudio,
  cameraConnected,
}: CamContainerProps) {
  return (
    <div className="flex-with-center flex-col gap-80 pt-80">
      <div className="flex justify-center gap-64 h-320">
        <CamBox
          videoRef={localVideoRef}
          cameraConnected={cameraConnected.local}
          defaultImage="bg-ddung"
        />
        <CamBox
          videoRef={remoteVideoRef}
          cameraConnected={cameraConnected.remote}
          defaultImage="bg-sponge"
        />
      </div>
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
  );
}
