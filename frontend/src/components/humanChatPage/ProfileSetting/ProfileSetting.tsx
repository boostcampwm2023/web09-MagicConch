import { CamBox } from '..';

import { InputText } from '@components/common';
import { Button, IconButton, InputFileButton } from '@components/common';
import { SelectOptions } from '@components/common';

import { useMediaInfo } from '@stores/zustandStores';
import { useProfileInfo } from '@stores/zustandStores';

import { DEFAULT_NICKNAME } from '@constants/nickname';

import { DeviceSelect } from './DeviceSelect';
import { DeviceToggleButtons } from './DeviceToggleButtons';

interface ProfileSettingProps {
  toggleVideo: () => void;
  toggleAudio: () => void;
  camList: SelectOptions[];
  micList: SelectOptions[];
  videoRef: React.RefObject<HTMLVideoElement>;
  changeMyCamera: (deviceId: string) => void;
  changeMyAudio: (deviceId: string) => void;
  onConfirm: () => void;
  onChangeProfileImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeNickname: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileSetting({
  camList,
  micList,
  videoRef,
  toggleVideo,
  toggleAudio,
  changeMyCamera,
  changeMyAudio,
  onConfirm,
  onChangeProfileImage,
  onChangeNickname,
}: ProfileSettingProps) {
  const { myNickname, myProfile } = useProfileInfo(state => ({
    myNickname: state.myNickname,
    myProfile: state.myProfile,
  }));

  const { myMicOn, myVideoOn, selectedAudioID, selectedCameraID } = useMediaInfo(state => ({
    myMicOn: state.myMicOn,
    myVideoOn: state.myVideoOn,
    selectedAudioID: state.selectedAudioID,
    selectedCameraID: state.selectedCameraID,
  }));

  return (
    <div className="relative w-[100vw] h-[100vh] flex-with-center z-10 lg:top-24">
      <div className="flex gap-24 sm:gap-0 flex-col rounded-lg p-32 surface-box sm:w-[100vw] sm:h-[100vh] sm:rounded-none sm:pt-[10vh]">
        <div className="flex-with-center flex-row sm:flex-col gap-48 sm:gap-12 z-10">
          <CamBox
            videoRef={videoRef}
            cameraConnected={myVideoOn}
            audioConnected={myMicOn}
            defaultImage="bg-ddung"
            profileInfo={myProfile}
            nickname={myNickname}
            defaultNickname={DEFAULT_NICKNAME.ME}
          />
          <div className="flex flex-col gap-24 sm:gap-10 sm:w-[80vw] sm:scale-90">
            <div className="flex justify-between gap-12">
              <div className="flex flex-col gap-4 w-240">
                <span className="text-strong display-bold14">프로필 이미지를 설정하세요.</span>
                <span className="text-strong display-medium12">카메라가 off 되었을 때 표시됩니다.</span>
              </div>
              <InputFileButton
                onChange={onChangeProfileImage}
                accept="image/*"
              >
                <IconButton
                  icon="ph:camera-bold"
                  iconColor="textWhite"
                  buttonColor="dark"
                />
              </InputFileButton>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-strong display-bold14">상대방에게 표시될 이름을 입력하세요.</span>
              <InputText onChange={onChangeNickname} />
            </div>
            <div className="z-20">
              <DeviceSelect
                name="카메라"
                deviceList={camList}
                onChange={changeMyCamera}
                defaultId={selectedCameraID}
              />
            </div>
            <div className="z-10">
              <DeviceSelect
                name="마이크"
                deviceList={micList}
                onChange={changeMyAudio}
                defaultId={selectedAudioID}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-20 justify-center sm:w-[80vw] sm:scale-90">
          <DeviceToggleButtons
            cameraActive={myVideoOn}
            micActive={myMicOn}
            toggleVideo={toggleVideo}
            toggleAudio={toggleAudio}
          />
          <Button
            onClick={onConfirm}
            color="dark"
            size="l"
            circle
          >
            <div className="w-32 h-32 flex-with-center">확인</div>
          </Button>
        </div>
      </div>
    </div>
  );
}
