import { useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { IconButton } from '@components/Buttons';
import CamContainer from '@components/CamContainer';

import { useBlocker } from '@business/hooks/useBlocker';
import useSpeakerHighlighter from '@business/hooks/useSpeakerHighlighter';
import { HumanSocketManager } from '@business/services/SocketManager';

import type { OutletContext } from './HumanChatPage';

export default function ChattingPage() {
  const {
    localVideoRef,
    remoteVideoRef,
    toggleVideo,
    toggleAudio,
    startWebRTC,
    joinRoom,
    tarotButtonClick,
    tarotButtonDisabled,
    setChatPageState,
    createRoom,
    chatPageState: { host, joined },
    changeMyVideoTrack,
  }: OutletContext = useOutletContext();

  const humanSocket = new HumanSocketManager();

  const { roomName } = useParams();
  const navigate = useNavigate();

  const { unblockGoBack } = useBlocker({
    when: ({ nextLocation }) => nextLocation.pathname === '/' || nextLocation.pathname === '/chat/human',
    onConfirm: () => navigate('/'),
  });

  useSpeakerHighlighter(localVideoRef);
  useSpeakerHighlighter(remoteVideoRef);

  useEffect(() => {
    if (!roomName) {
      alert('잘못된 접근입니다.');
      return;
    }
    if (joined) {
      changeMyVideoTrack();
      return;
    }

    humanSocket.connect();
    startWebRTC({ roomName: roomName as string });

    if (host) {
      createRoom({
        roomName,
        onSuccess: ({ close }) => {
          close();
        },
        onClose: ({ close }) => {
          close();
          navigate('/');
        },
      });
    } else {
      joinRoom({
        roomName,
        onSuccess: ({ close }) => {
          close();
        },
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
        onRoomNotExist: () => {
          unblockGoBack();
          alert('방이 존재하지 않습니다, 첫페이지로 이동합니다.');
          navigate('/');
        },
      });
    }
    setChatPageState(prev => ({ ...prev, joined: true }));
  }, []);

  return (
    <>
      <CamContainer
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        toggleVideo={toggleVideo}
        toggleAudio={toggleAudio}
        tarotButtonClick={tarotButtonClick}
        tarotButtonDisabled={tarotButtonDisabled}
      />
      <div className="absolute top-[10vh] right-90">
        <IconButton
          icon="uil:setting"
          iconColor="textWhite"
          buttonColor="cancel"
          onClick={() => navigate('setting')}
        />
      </div>
    </>
  );
}
