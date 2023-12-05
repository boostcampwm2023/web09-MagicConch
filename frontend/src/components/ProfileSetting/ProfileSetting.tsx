import { Button, IconButton } from '@components/Buttons';
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
    <div className="relative w-[100vw] h-[100vh] flex-with-center z-10 lg:top-24">
      <div className="flex gap-24 sm:gap-0 flex-col rounded-lg p-32 surface-box sm:w-[100vw] sm:h-[100vh] sm:rounded-none sm:pt-[10vh]">
        <div className="flex-with-center flex-row sm:flex-col gap-48 sm:gap-12 z-10">
          <CamBox
            videoRef={videoRef}
            cameraConnected={cameraConnected.local}
            audioConnected={audioConnected.local}
            defaultImage="bg-ddung"
          />
          <div className="flex flex-col gap-24 sm:gap-10 sm:w-[80vw] sm:scale-90">
            <div className="flex justify-between gap-12">
              <div className="flex flex-col gap-4 w-240">
                <span className="text-strong display-bold14">프로필 이미지를 설정하세요.</span>
                <span className="text-strong display-medium12">카메라가 off 되었을 때 표시됩니다.</span>
              </div>
              <IconButton
                icon="ph:camera-bold"
                buttonColor="dark"
              />
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-strong display-bold14">상대방에게 표시될 이름을 입력하세요.</span>
              <input
                className="input input-bordered rounded-2xl"
                type="text"
                placeholder="닉네임을 입력하세요."
              />
            </div>
            <div className="z-20">
              <DeviceSelect
                name="카메라"
                deviceList={camList}
                onChange={changeMyCamera}
              />
            </div>
            <div className="z-10">
              <DeviceSelect
                name="마이크"
                deviceList={micList}
                onChange={changeMyAudio}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-20 justify-center sm:w-[80vw] sm:scale-90">
          <DeviceToggleButtons
            cameraActive={cameraConnected.local}
            micActive={audioConnected.local}
            toggleVideo={toggleVideo}
            toggleAudio={toggleAudio}
          />
          <Button
            onClick={onConfirm}
            color="dark"
            size="l"
            circle
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
