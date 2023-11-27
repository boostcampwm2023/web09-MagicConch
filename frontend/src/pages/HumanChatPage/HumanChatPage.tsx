import { useParams } from 'react-router-dom';

import Background from '@components/Background';
import CustomButton from '@components/Buttons/CustomButton';
import ChatContainer from '@components/ChatContainer';
import CustomSelect from '@components/CustomSelect';
import Header from '@components/Header';
import SideBar from '@components/SideBar';

import { useWebRTC } from '@business/hooks/useWebRTC';

export default function HumanChatPage() {
  const { roomName } = useParams();

  const { cameraOptions, localVideoRef, remoteVideoRef, toggleAudio, toggleVideo, changeCamera } = useWebRTC(
    roomName as string,
  );

  return (
    <Background type="dynamic">
      <Header
        rightItems={[
          <SideBar key="chat-side-bar">
            <ChatContainer
              width="w-400"
              height="h-4/5"
              position="top-40"
            />
          </SideBar>,
        ]}
      />
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
    </Background>
  );
}
