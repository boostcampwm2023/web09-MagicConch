import { useKakaoOAuth } from '@business/hooks/useAuth';

import { Icon } from '@iconify/react/dist/iconify.js';

import Button from './Button';

interface KakaoLoginButtonProps {
  width?: number;
}

function KakaoLoginButton({ width }: KakaoLoginButtonProps) {
  const { requestAuthorization } = useKakaoOAuth();

  return (
    <Button
      color="kakao"
      width={width}
      onClick={requestAuthorization}
    >
      <div className="relative w-full h-full text-center">
        <div className="absolute h-full flex-with-center">
          <Icon icon="f7:chat-bubble-fill" />
        </div>
        <div className="w-full">카카오로 시작하기</div>
      </div>
    </Button>
  );
}

export default KakaoLoginButton;
