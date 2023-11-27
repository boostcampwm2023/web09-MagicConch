import { useState } from 'react';

import { CustomButton, IconButton, IconToggleButton } from '@components/Buttons';
import CustomSelect from '@components/CustomSelect';

interface ProfileSettingProps {
  close: () => void;
}

export default function ProfileSetting({ close }: ProfileSettingProps) {
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);

  const cameraToggle = () => {
    setCameraActive(cameraActive => !cameraActive);
  };
  const micToggle = () => {
    setMicActive(micActive => !micActive);
  };

  const camList = [
    { label: '카메라1', value: 'camera1', selected: true },
    { label: '카메라2', value: 'camera2' },
    { label: '카메라3', value: 'camera3' },
  ];

  const micList = [
    { label: '마이크1', value: 'mic1', selected: true },
    { label: '마이크2', value: 'mic2' },
    { label: '마이크3', value: 'mic3' },
  ];

  return (
    <div className="w-[100vw] h-[100vh] flex-with-center">
      <div className="flex gap-48 rounded-lg p-64 surface-box">
        <div className="flex flex-col gap-24">
          {/* TODO: Cam component기 완성되면 바꿔야 함. */}
          <img
            className="w-320 h-320"
            src="/ddung.png"
          />
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
        </div>
        <div className="flex flex-col gap-24">
          <div className="flex-with-center gap-12">
            <div className="flex flex-col gap-4">
              <span className="text-strong display-bold14">프로필 이미지를 설정하세요.</span>
              <span className="text-strong display-medium12">카메라가 off 되었을 때 표시됩니다.</span>
            </div>
            <IconButton
              icon="ph:camera-bold"
              iconColor="textWhite"
              iconSize={24}
              buttonSize="m"
              buttonColor="dark"
              circle
            />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-strong display-bold14">상대방에게 표시될 이름을 입력하세요.</span>
            <input
              className="input input-bordered input-sm"
              type="text"
              placeholder="닉네임을 입력하세요."
            />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-strong display-bold14">사용할 카메라 장치를 선택하세요.</span>
            <CustomSelect options={camList} />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-strong display-bold14">사용할 오디오 장치를 선택하세요.</span>
            <CustomSelect options={micList} />
          </div>
          <CustomButton
            onClick={close}
            color="dark"
          >
            확인
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
