import { useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { useSignalingSocket, useWebRTC } from '@business/hooks/useWebRTC';
import { HumanSocketManager } from '@business/services/SocketManager';

import { useSideBarStore } from '@stores/zustandStores/useSideBarStore';

import { ERROR_MESSAGE } from '@constants/messages';

import { OutletContext } from './HumanChatPage';

interface useChattingPageCreateJoinRoomParams {
  unblockGoBack: (cb: () => void) => void;
}
export function useChattingPageCreateJoinRoomPasswordPopup({ unblockGoBack }: useChattingPageCreateJoinRoomParams) {
  const {
    chatPageState: { host, joined },
  }: OutletContext = useOutletContext();

  const humanSocket = HumanSocketManager.getInstance();
  const { createRoom, joinRoom, checkRoomExist } = useSignalingSocket();
  const { startWebRTC } = useWebRTC();
  const { enableSideBarButton } = useSideBarStore();

  const { roomName } = useParams();
  const navigate = useNavigate();

  const _joinRoom = () => {
    joinRoom({
      roomName: roomName as string,
      onSuccess: ({ closePopup }) => {
        navigate('setting');
        closePopup();
        enableSideBarButton();
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
      onSuccess: ({ closePopup }) => {
        navigate('setting');
        closePopup();
        enableSideBarButton();
      },
      onCancel: () => {
        unblockGoBack(() => {
          navigate('/');
        });
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
