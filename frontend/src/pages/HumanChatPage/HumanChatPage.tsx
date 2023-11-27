import { useParams } from 'react-router-dom';

import Background from '@components/Background';
import CustomButton from '@components/Buttons/CustomButton';
import CamBox from '@components/CamBox';
import CamContainer from '@components/CamContainer';
import CustomSelect, { OnChangeSelectFunction } from '@components/CustomSelect';
import Header from '@components/Header';

import { useWebRTC } from '@business/hooks/useWebRTC';

import { Icon } from '@iconify/react/dist/iconify.js';

export default function HumanChatPage() {
  const { roomName } = useParams();

  const {
    cameraOptions,
    localVideoRef,
    remoteVideoRef,
    toggleAudio,
    toggleVideo,
    changeCamera,
    cameraConnected,
    changeVideoTrack,
  } = useWebRTC(roomName as string);

  const changeMyCamera = async ({ value }: OnChangeSelectFunction) => {
    await changeCamera(value);
    changeVideoTrack();
  };

  return (
    <Background type="dynamic">
      <Header
        rightItems={[
          <CustomButton
            color="transparent"
            circle
            key="side-panel-close"
          >
            <Icon
              className="text-25"
              icon="carbon:side-panel-close"
            />
          </CustomButton>,
        ]}
      />
      <CamContainer
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        toggleVideo={toggleVideo}
        toggleAudio={toggleAudio}
        cameraConnected={cameraConnected}
      />
      {/* <div className="w-full h-10 flex justify-center gap-5">
        <CustomButton onClick={toggleVideo}>video</CustomButton>
        <CustomButton onClick={toggleAudio}>mic</CustomButton>
        <CustomSelect
          onChange={changeMyCamera}
          options={cameraOptions.map(({ deviceId, label }) => ({ label, value: deviceId }))}
        />
      </div> */}
    </Background>
  );
}
