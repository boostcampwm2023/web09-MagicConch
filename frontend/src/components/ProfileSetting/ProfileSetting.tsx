import { CustomButton, IconButton } from '@components/Buttons';
import CamBox from '@components/CamBox';
import { CustomSelectOptions } from '@components/CustomSelect';

import DeviceSelect from './DeviceSelect';
import DeviceToggleButtons from './DeviceToggleButtons';

interface ProfileSettingProps {
  toggleVideo: () => void;
  toggleAudio: () => void;
  camList: CustomSelectOptions[];
  micList: CustomSelectOptions[];
  videoRef: React.RefObject<HTMLVideoElement>;
  cameraConnected: { local: boolean; remote: boolean };
  audioConnected: { local: boolean; remote: boolean };
  changeMyCamera: (deviceId: string) => void;
  changeMyAudio: (deviceId: string) => void;
  onConfirm: () => void;
}

export default function ProfileSetting({
  toggleVideo,
  toggleAudio,
  camList,
  micList,
  videoRef,
  cameraConnected,
  audioConnected,
  changeMyCamera,
  changeMyAudio,
  onConfirm,
}: ProfileSettingProps) {
  return (
    <div className="w-[100vw] h-[100vh] flex-with-center z-10">
      <div className="flex gap-48 rounded-lg p-64 surface-box">
        <div className="flex flex-col gap-24">
          <CamBox
            videoRef={videoRef}
            cameraConnected={cameraConnected.local}
            audioConnected={audioConnected.local}
            defaultImage="bg-ddung"
          />
          <DeviceToggleButtons
            cameraActive={cameraConnected.local}
            micActive={audioConnected.local}
            toggleVideo={toggleVideo}
            toggleAudio={toggleAudio}
          />
        </div>
        <div className="flex flex-col gap-24">
          <div className="flex-with-center gap-12">
            <div className="flex flex-col gap-4 w-240">
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
            onChange={changeMyCamera}
          />
          <DeviceSelect
            name="마이크"
            deviceList={micList}
            onChange={changeMyAudio}
          />
          <CustomButton
            onClick={onConfirm}
            color="dark"
          >
            확인
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
