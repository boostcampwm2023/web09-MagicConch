import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export function useHumanChatPageWrongURL() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomName } = useParams();

  useEffect(() => {
    if (!roomName && !location.state?.host) {
      navigate('/');
      alert('잘못된 접근입니다.');
      return;
    }
  }, []);
}
