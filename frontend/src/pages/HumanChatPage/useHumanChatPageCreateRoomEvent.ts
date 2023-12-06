import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { HumanSocketManager } from '@business/services/SocketManager';

export interface ChatPageState {
  joined: boolean;
  host: boolean;
}
export function useHumanChatPageCreateRoomEvent() {
  const humanSocket = new HumanSocketManager();
  const navigate = useNavigate();
  const location = useLocation();

  const [chatPageState, setChatPageState] = useState<ChatPageState>({
    joined: false,
    host: false,
  });

  useEffect(() => {
    if (!location.state?.host) {
      return;
    }
    setChatPageState(prev => ({ ...prev, host: true }));

    humanSocket.connect();
    humanSocket.emit('generateRoomName');
    humanSocket.on('roomNameGenerated', (roomName: string) => {
      navigate(roomName);
    });

    return () => {
      humanSocket.disconnect();
    };
  }, []);

  return { chatPageState, setChatPageState };
}
