import { IconToggleButton } from '@components/Buttons';

interface DeviceToggleButtonsProps {
  cameraActive: boolean;
  micActive: boolean;
  cameraToggle: () => void;
  micToggle: () => void;
}

export default function DeviceToggleButtons({
  cameraActive,
  micActive,
  cameraToggle,
  micToggle,
}: DeviceToggleButtonsProps) {
  return (
    <div className="flex-with-center gap-36">
      <IconToggleButton
        activeIcon="pepicons-pop:camera"
        disabledIcon="pepicons-pop:camera-off"
        iconSize={28}
        buttonSize="l"
        active={cameraActive}
        onClick={cameraToggle}
      />
      <IconToggleButton
        activeIcon="mingcute:mic-line"
        disabledIcon="mingcute:mic-off-line"
        iconSize={28}
        buttonSize="l"
        active={micActive}
        onClick={micToggle}
      />
    </div>
  );
}
