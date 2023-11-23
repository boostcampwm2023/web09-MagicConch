import { useParams } from 'react-router-dom';

import CustomButton from '@components/Buttons/CustomButton';
import CustomSelect from '@components/CustomSelect';

import { useWebRTC } from '@business/hooks/useWebRTC';

import CamBox from './CamBox';

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

  return (
    <div className="w-h-full flex-with-center flex-col gap-10 ">
      <div className="flex justify-center gap-20 h-320">
        <CamBox
          videoRef={localVideoRef}
          cameraConnected={cameraConnected.local}
          defaultImage="bg-ddung"
        />
        <CamBox
          videoRef={remoteVideoRef}
          cameraConnected={cameraConnected.remote}
          defaultImage="bg-sponge"
        />
      </div>
      <div className="w-full h-10 flex justify-center gap-5">
        <CustomButton onClick={toggleVideo}>video</CustomButton>
        <CustomButton onClick={toggleAudio}>mic</CustomButton>
        <CustomSelect
          onChange={async ({ value }) => {
            await changeCamera(value);
            changeVideoTrack();
          }}
          options={cameraOptions.map(({ deviceId, label }) => ({ label, value: deviceId }))}
        />
      </div>
    </div>
  );
}
