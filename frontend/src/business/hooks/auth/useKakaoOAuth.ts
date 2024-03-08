import axios from 'axios';

import { KAKAO_AUTH_URL, KAKAO_LOGOUT_URL } from '@constants/kakao';

export function useKakaoOAuth() {
  const requestAuthorization = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  const logout = async () => {
    const res = await axios.get(KAKAO_LOGOUT_URL, { withCredentials: true });
    if (res.status === 200) {
      window.location.reload();
    }
  };

  return { requestAuthorization, logout };
}
