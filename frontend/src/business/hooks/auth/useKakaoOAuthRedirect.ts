import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { KAKAO_LOGIN_URL } from '@constants/kakao';

export function useKakaoOAuthRedirect() {
  const navigate = useNavigate();
  const code = new URLSearchParams(window.location.search).get('code');

  const login = async () => {
    const res = await axios.get(KAKAO_LOGIN_URL, {
      params: { code },
      withCredentials: true,
    });

    if (!res || res.status !== 200) {
      navigate('/');
    }
    navigate('/chat/ai');
  };

  return { login };
}