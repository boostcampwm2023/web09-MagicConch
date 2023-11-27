import { useState } from 'react';

import { IconToggleButton } from '@components/Buttons';

interface ProfileSettingProps {}

export default function ProfileSetting({}: ProfileSettingProps) {
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);

  const cameraToggle = () => {
    setCameraActive(cameraActive => !cameraActive);
  };
  const micToggle = () => {
    setMicActive(micActive => !micActive);
  };

  return (
    <div className="w-[100vw] h-[100vh] flex-with-center">
      <div className="flex-with-center gap-48 rounded-lg p-64 surface-box">
        <div className="flex-with-center flex-col gap-32">
          {/* TODO: Cam component기 완성되면 바꿔야 함. */}
          <img
            className="w-240 h-240"
            src="/ddung.png"
          />
          <div className="flex-with-center gap-28">
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
        </div>
      </div>
    </div>
  );
}
