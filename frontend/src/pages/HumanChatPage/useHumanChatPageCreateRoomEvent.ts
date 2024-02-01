import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { HumanSocketManager } from '@business/services/SocketManager';

import { useHumanChatPage } from '@stores/zustandStores/useHost';

export interface ChatPageState {
  joined: boolean;
  host: boolean;
}
export function useHumanChatPageCreateRoomEvent() {
  const humanSocket = HumanSocketManager.getInstance();
  const navigate = useNavigate();
  const location = useLocation();

  const { setHost } = useHumanChatPage(state => ({ setHost: state.setHost }));

  useEffect(() => {
    if (!location.state?.host) {
      return;
    }

    humanSocket.connect();
    humanSocket.emit('generateRoomName');
    humanSocket.on('roomNameGenerated', (roomName: string) => {
      setHost(true);
      navigate(roomName);
    });

    return () => {
      humanSocket.disconnect();
    };
  }, []);
}
