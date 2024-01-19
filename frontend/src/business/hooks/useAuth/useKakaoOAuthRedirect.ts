import { useNavigate } from 'react-router-dom';

import { KAKAO_LOGIN_URL } from '@constants/kakao';

export function useKakaoOAuthRedirect() {
  const navigate = useNavigate();
  const code = new URLSearchParams(window.location.search).get('code');

  const login = async () => {
    const res = await fetch(KAKAO_LOGIN_URL + `?code=${code}`);
    if (!res.ok || res.status !== 200) {
      navigate('/');
    }
    navigate('/chat/ai');
  };

  return { login };
}
