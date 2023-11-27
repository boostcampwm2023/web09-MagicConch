import { IconButton } from '@components/Buttons';
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
      <div className="flex-with-center gap-64">
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
        <IconButton
          icon="pepicons-pop:camera"
          iconColor="textWhite"
          iconSize={28}
          buttonColor="active"
          buttonSize="l"
          onClick={toggleVideo}
        />
        <IconButton
          icon="mingcute:mic-line"
          iconColor="textWhite"
          iconSize={28}
          buttonColor="active"
          buttonSize="l"
          onClick={toggleAudio}
        />
      </div>
    </div>
  );
}
