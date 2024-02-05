import { IconToggleButton } from '@components/common/Buttons';

interface DeviceToggleButtonsProps {
  cameraActive: boolean;
  micActive: boolean;
  toggleVideo: () => void;
  toggleAudio: () => void;
}

export function DeviceToggleButtons({ cameraActive, micActive, toggleVideo, toggleAudio }: DeviceToggleButtonsProps) {
  return (
    <div className="flex-with-center gap-20">
      <IconToggleButton
        activeIcon="pepicons-pop:camera"
        inactiveIcon="pepicons-pop:camera-off"
        size="l"
        active={cameraActive}
        onClick={toggleVideo}
      />
      <IconToggleButton
        activeIcon="mingcute:mic-line"
        inactiveIcon="mingcute:mic-off-line"
        size="l"
        active={micActive}
        onClick={toggleAudio}
      />
    </div>
  );
}
