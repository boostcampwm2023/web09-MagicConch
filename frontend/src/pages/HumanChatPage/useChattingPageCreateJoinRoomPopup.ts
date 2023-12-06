import { useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { HumanSocketManager } from '@business/services/SocketManager';

import { OutletContext } from './HumanChatPage';

interface useChattingPageCreateJoinRoomParams {
  unblockGoBack: () => void;
}
export function useChattingPageCreateJoinRoomPasswordPopup({ unblockGoBack }: useChattingPageCreateJoinRoomParams) {
  const {
    chatPageState: { host, joined },
    startWebRTC,
    joinRoom,
    createRoom,
    checkRoomExist,
  }: OutletContext = useOutletContext();

  const humanSocket = new HumanSocketManager();

  const { roomName } = useParams();
  const navigate = useNavigate();

  const _joinRoom = () => {
    joinRoom({
      roomName: roomName as string,
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
    });
  };

  const _createRoom = () => {
    createRoom({
      roomName: roomName as string,
      onSuccess: ({ close }) => {
        close();
      },
      onClose: ({ close }) => {
        close();
        navigate('/');
      },
    });
  };

  const goRootPageWithMessage = () => {
    unblockGoBack();
    alert('방이 존재하지 않습니다, 첫페이지로 이동합니다.');
    navigate('/');
  };

  useEffect(() => {
    if (joined) {
      return;
    }

    humanSocket.connect();
    startWebRTC({ roomName: roomName as string });

    if (host) {
      _createRoom();
    } else {
      checkRoomExist({
        roomName: roomName as string,
        onExistRoom: _joinRoom,
        onRoomNotExist: goRootPageWithMessage,
      });
    }
  }, []);
}
