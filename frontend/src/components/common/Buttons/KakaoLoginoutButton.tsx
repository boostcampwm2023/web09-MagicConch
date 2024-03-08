import { Button } from '.';

import { useKakaoOAuth } from '@business/hooks/auth';

import { Icon } from '@iconify/react';

interface KakaoLoginoutButtonProps {}

export function KakaoLoginoutButton({}: KakaoLoginoutButtonProps) {
  const { logout } = useKakaoOAuth();

  return (
    <Button
      color="cancel"
      size="s"
      onClick={logout}
    >
      <div className="relative w-full h-full text-center">
        <div className="absolute h-full flex-with-center">
          <Icon icon="f7:chat-bubble-fill" />
        </div>
        <div className="pl-24">로그아웃</div>
      </div>
    </Button>
  );
}
