import { useState } from 'react';

import { CustomButton, IconButton } from '@components/Buttons';

import DeviceSelect from './DeviceSelect';
import DeviceToggleButtons from './DeviceToggleButtons';

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
          <DeviceToggleButtons
            cameraActive={cameraActive}
            micActive={micActive}
            cameraToggle={cameraToggle}
            micToggle={micToggle}
          />
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
          <DeviceSelect
            name="카메라"
            deviceList={camList}
            onChange={console.log}
          />
          <DeviceSelect
            name="마이크"
            deviceList={micList}
            onChange={console.log}
          />
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
