import { useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { useSignalingSocket } from '@business/hooks/useWebRTC/useSignalingSocket';
import { HumanSocketManager } from '@business/services/SocketManager';

import { ERROR_MESSAGE } from '@constants/messages';

import { OutletContext } from './HumanChatPage';

interface useChattingPageCreateJoinRoomParams {
  unblockGoBack: (cb: () => void) => void;
  enableSideBar: () => void;
}
export function useChattingPageCreateJoinRoomPasswordPopup({
  unblockGoBack,
  enableSideBar,
}: useChattingPageCreateJoinRoomParams) {
  const {
    chatPageState: { host, joined },
    startWebRTC,
  }: OutletContext = useOutletContext();

  const humanSocket = HumanSocketManager.getInstance();
  const { createRoom, joinRoom, checkRoomExist } = useSignalingSocket();

  const { roomName } = useParams();
  const navigate = useNavigate();

  const _joinRoom = () => {
    joinRoom({
      roomName: roomName as string,
      onSuccess: ({ close }) => {
        navigate('setting');
        close();
        enableSideBar();
      },
      onFull: () => {
        unblockGoBack(() => {
          alert(ERROR_MESSAGE.FULL_ROOM);
          navigate('/');
        });
      },
      onFail: () => {
        alert(ERROR_MESSAGE.WRONG_PASSWORD);
      },
      onHostExit: () => {
        unblockGoBack(() => {
          alert(ERROR_MESSAGE.HOST_EXIT);
          navigate('/');
        });
      },
    });
  };

  const _createRoom = () => {
    createRoom({
      roomName: roomName as string,
      onSuccess: ({ close }) => {
        navigate('setting');
        close();
        enableSideBar();
      },
      onClose: ({ close }) => {
        close();
        navigate('/');
      },
    });
  };

  const goRootPageWithMessage = () => {
    unblockGoBack(() => {
      alert(ERROR_MESSAGE.ROOM_NOT_EXIST);
      navigate('/');
    });
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
