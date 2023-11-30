import { useEffect } from 'react';
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { IconButton } from '@components/Buttons';
import CamContainer from '@components/CamContainer';

import type { OutletContext } from './HumanChatPage';

export default function ChattingPage() {
  const { localVideoRef, remoteVideoRef, toggleVideo, toggleAudio, mediaInfos, startWebRTC, joinRoom }: OutletContext =
    useOutletContext();

  const { roomName } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    startWebRTC({ roomName: roomName as string });

    if (!roomName || state?.host) {
      return;
    }

    joinRoom({
      roomName,
      onFull: () => {
        alert('방이 꽉 찼습니다, 첫페이지로 이동합니다.');
        navigate('/');
      },
      onFail: () => {
        alert('잘못된 링크거나 비밀번호가 틀렸습니다.');
      },
      onHostExit: () => {
        navigate('/');
        alert('호스트가 방을 나갔습니다, 첫페이지로 이동합니다.');
      },
    });
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
