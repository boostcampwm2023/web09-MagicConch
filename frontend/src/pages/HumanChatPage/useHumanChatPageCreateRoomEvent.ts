import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { HumanSocketManager } from '@business/services/SocketManager';

export function useHumanChatPageCreateRoomEvent({ becomeHost }: { becomeHost: VoidFunction }) {
  const humanSocket = HumanSocketManager.getInstance();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state?.host) {
      return;
    }

    humanSocket.connect();
    humanSocket.emit('generateRoomName');
    humanSocket.on('roomNameGenerated', (roomName: string) => {
      becomeHost();
      navigate(roomName);
    });

    return () => {
      humanSocket.disconnect();
    };
  }, []);
}
