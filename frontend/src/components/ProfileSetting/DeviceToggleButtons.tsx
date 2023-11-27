import { IconToggleButton } from '@components/Buttons';

interface DeviceToggleButtonsProps {
  cameraActive: boolean;
  micActive: boolean;
  toggleVideo: () => void;
  toggleAudio: () => void;
}

export default function DeviceToggleButtons({
  cameraActive,
  micActive,
  toggleVideo,
  toggleAudio,
}: DeviceToggleButtonsProps) {
  return (
    <div className="flex-with-center gap-36">
      <IconToggleButton
        activeIcon="pepicons-pop:camera"
        disabledIcon="pepicons-pop:camera-off"
        iconSize={28}
        buttonSize="l"
        active={cameraActive}
        onClick={toggleVideo}
      />
      <IconToggleButton
        activeIcon="mingcute:mic-line"
        disabledIcon="mingcute:mic-off-line"
        iconSize={28}
        buttonSize="l"
        active={micActive}
        onClick={toggleAudio}
      />
    </div>
  );
}
