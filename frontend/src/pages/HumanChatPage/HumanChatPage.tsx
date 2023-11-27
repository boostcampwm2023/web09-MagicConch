import { useParams } from 'react-router-dom';

import CustomButton from '@components/Buttons/CustomButton';
import CustomSelect from '@components/CustomSelect';

import { useDataChannelContext } from '@business/hooks/useDataChannelContext';
import { useWebRTC } from '@business/hooks/useWebRTC';

import CamBox from './CamBox';

export default function HumanChatPage() {
  const {
    mediaInfos: { myMicOn, myVideoOn, remoteMicOn, remoteVideoOn },
  } = useDataChannelContext();

  const { roomName } = useParams();

  const { cameraOptions, localVideoRef, remoteVideoRef, changeVideoTrack, changeCamera, toggleAudio, toggleVideo } =
    useWebRTC({ roomName: roomName as string });

  return (
    <div className="w-h-full flex-with-center flex-col gap-10 ">
      <div className="flex justify-center gap-20 h-320 ">
        <CamBox
          videoRef={localVideoRef}
          cameraConnected={myVideoOn}
          audioConnected={myMicOn}
          defaultImage="bg-ddung"
        />
        <CamBox
          videoRef={remoteVideoRef}
          cameraConnected={remoteVideoOn}
          audioConnected={remoteMicOn}
          defaultImage="bg-sponge"
        />
      </div>
      <div className="w-full h-10 flex justify-center gap-5">
        <CustomButton onClick={() => toggleVideo()}>video</CustomButton>
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
