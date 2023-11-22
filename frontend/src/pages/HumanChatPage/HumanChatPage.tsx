import { useParams } from 'react-router-dom';

import CustomButton from '@components/CustomButton';
import CustomSelect from '@components/CustomSelect';

import { useWebRTC } from '@business/hooks/useWebRTC';

export default function HumanChatPage() {
  const { roomName } = useParams();

  const { cameraOptions, localVideoRef, remoteVideoRef, toggleAudio, toggleVideo, changeCamera } = useWebRTC(
    roomName as string,
  );

  return (
    <div className="w-h-full flex-with-center flex-col gap-10 ">
      <div className="flex justify-center">
        <video
          className="w-320 h-180 bg-blue-200"
          ref={localVideoRef}
          autoPlay
          playsInline
        />
        <video
          className="w-320 h-180 bg-red-200"
          ref={remoteVideoRef}
          autoPlay
          playsInline
        />
      </div>
      <div className="w-full h-10 flex justify-center gap-5">
        <CustomButton onClick={toggleVideo}>video</CustomButton>
        <CustomButton onClick={toggleAudio}>mic</CustomButton>
        <CustomSelect
          onChange={({ value }) => {
            changeCamera(value);
          }}
          options={cameraOptions.map(({ deviceId, label }) => ({ label, value: deviceId }))}
        />
      </div>
    </div>
  );
}
