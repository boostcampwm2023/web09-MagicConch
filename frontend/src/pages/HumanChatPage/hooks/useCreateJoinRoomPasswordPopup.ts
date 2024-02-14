import { OutletContext } from '..';
import { useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { useSignalingSocket, useWebRTC } from '@business/hooks/webRTC';
import { HumanSocketManager } from '@business/services/SocketManager';

import { useSideBarStore } from '@stores/zustandStores';

import { ERROR_MESSAGE } from '@constants/messages';

interface useCreateJoinRoomParams {
  unblockGoBack: (cb: () => void) => void;
}
export function useCreateJoinRoomPasswordPopup({ unblockGoBack }: useCreateJoinRoomParams) {
  const humanSocket = HumanSocketManager.getInstance();
  const { host, joinedRoom } = useOutletContext<OutletContext>();

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
    if (joinedRoom) {
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
