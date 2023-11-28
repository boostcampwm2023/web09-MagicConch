import { useParams } from 'react-router-dom';

import Background from '@components/Background';
import CustomButton from '@components/Buttons/CustomButton';
import CamBox from '@components/CamBox';
import ChatContainer from '@components/ChatContainer';
import CustomSelect, { CustomSelectOptions } from '@components/CustomSelect';
import Header from '@components/Header';
import SideBar from '@components/SideBar';

import { useWebRTC } from '@business/hooks/useWebRTC';

export default function HumanChatPage() {
  const { roomName } = useParams();

  const {
    mediaInfos,
    cameraOptions,
    audioOptions,
    localVideoRef,
    remoteVideoRef,
    changeMyAudioTrack,
    changeMyVideoTrack,
    toggleAudio,
    toggleVideo,
  } = useWebRTC({ roomName: roomName as string });

  const { myMicOn, myVideoOn, remoteMicOn, remoteVideoOn } = mediaInfos;

  const changeMyCamera = async ({ value }: CustomSelectOptions) => {
    await changeCamera(value);
    changeVideoTrack();
  };

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
          onChange={({ value }) => changeMyVideoTrack(value)}
          options={cameraOptions.map(({ deviceId, label }) => ({ label, value: deviceId }))}
        />

        <CustomSelect
          onChange={({ value }) => changeMyAudioTrack(value)}
          options={audioOptions.map(({ deviceId, label }) => ({ label, value: deviceId }))}
        />
      <div className="w-h-full flex-with-center flex-col gap-10 ">
        <div className="flex justify-center gap-20 h-320 ">
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
        <div className="w-full flex justify-center gap-5">
          <CustomButton onClick={toggleVideo}>video</CustomButton>
          <CustomButton onClick={toggleAudio}>mic</CustomButton>
          <CustomSelect
            onChange={changeMyCamera}
            options={cameraOptions.map(({ deviceId, label }) => ({ label, value: deviceId }))}
          />
        </div>
      </div>
    </Background>
  );
}
