import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { IconButton } from '@components/Buttons';
import CamContainer from '@components/CamContainer';

import type { OutletContext } from './HumanChatPage';

export default function ChattingPage() {
  const navigate = useNavigate();

  const { localVideoRef, remoteVideoRef, toggleVideo, toggleAudio, mediaInfos, getMedia }: OutletContext =
    useOutletContext();

  useEffect(() => {
    // startWebRTC().then(() => {
    //   console.log('connected');
    // });
    // getMedia({});
    // TODO: 여기 들어오면 소켓을 연결시킴.
  }, []);

  return (
    <>
      <CamContainer
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        toggleVideo={toggleVideo}
        toggleAudio={toggleAudio}
        cameraConnected={{ local: mediaInfos.myVideoOn, remote: mediaInfos.remoteVideoOn }}
        audioConnected={{ local: mediaInfos.myMicOn, remote: mediaInfos.remoteMicOn }}
      />
      <div className="absolute top-72 left-25">
        <IconButton
          icon="uil:setting"
          iconColor="textWhite"
          iconSize={36}
          buttonSize="m"
          buttonColor="cancel"
          circle
          onClick={() => navigate('setting')}
        />
      </div>
    </>
  );
}
