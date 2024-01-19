import { KAKAO_AUTH_URL } from '@constants/kakao';

export function useKakaoOAuth() {
  const requestAuthorization = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return { requestAuthorization };
}
