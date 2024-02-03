import { useState } from 'react';

export function useHumanChatPageState() {
  const [joinedRoom, setJoined] = useState(false);
  const [host, setHost] = useState(false);

  const joinRoom = () => setJoined(true);

  const becomeHost = () => setHost(true);

  return {
    joinedRoom,
    host,
    joinRoom,
    becomeHost,
  };
}
