import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useHumanChatPageWrongURL(roomName?: string, host?: boolean) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!roomName && !host) {
      alert('잘못된 접근입니다.');
      navigate('/');
      return;
    }
  }, []);
}
