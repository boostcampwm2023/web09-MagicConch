import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { ERROR_MESSAGE } from '@constants/messages';

export function usePageWrongURL() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomName } = useParams();

  useEffect(() => {
    if (!roomName && !location.state?.host) {
      alert(ERROR_MESSAGE.NOT_ALLOWED);
      navigate('/');
      return;
    }
  }, []);
}
