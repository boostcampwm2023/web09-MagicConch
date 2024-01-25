import { useKakaoOAuth } from '@business/hooks/useAuth';

function KakaoLoginButton() {
  const { requestAuthorization } = useKakaoOAuth();

  return (
    <button className="absolute">
      <img
        src="/kakao_login_medium_wide.png"
        onClick={requestAuthorization}
      />
    </button>
  );
}

export default KakaoLoginButton;
