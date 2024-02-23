import { useState } from 'react';
import { useParams } from 'react-router-dom';

export function useHumanChatPageState() {
  const [joinedRoom, setJoined] = useState(false);
  const [host, setHost] = useState(false);
  const [roomNameState, setRoomNameState] = useState('');

  const { roomName } = useParams();

  const joinRoom = () => {
    setJoined(true);
    setRoomNameState(roomName ?? '');
  };

  const becomeHost = () => setHost(true);

  const leaveRoom = () => {
    setJoined(false);
    setHost(false);
    setRoomNameState('');
  };

  return {
    joinedRoom,
    host,
    joinRoom,
    becomeHost,
    leaveRoom,
    roomName: roomNameState,
  };
}
