import { Button } from '.';

import { useKakaoOAuth } from '@business/hooks/auth';

import { Icon } from '@iconify/react';

interface KakaoLoginButtonProps {
  width?: number;
}

export function KakaoLoginButton({ width }: KakaoLoginButtonProps) {
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
        <div className="pl-12">카카오로 시작하기</div>
      </div>
    </Button>
  );
}
