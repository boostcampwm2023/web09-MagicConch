import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { HumanSocketManager } from '@business/services/SocketManager';

export function useHumanChatPageSocket(roomName?: string, host?: boolean) {
  const humanSocket = new HumanSocketManager();
  const navigate = useNavigate();

  const [chatPageState, setChatPageState] = useState({
    roomName: '',
    joined: false,
    host: false,
  });

  useEffect(() => {
    if (!roomName && !host) {
      alert('잘못된 접근입니다.');
      navigate('/');
      return;
    }

    if (!host) {
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
