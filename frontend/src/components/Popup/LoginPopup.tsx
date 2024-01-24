import { Button } from '@components/Buttons';

import { Icon } from '@iconify/react/dist/iconify.js';

export default function LoginPopup() {
  return (
    <div className="w-[100vw] h-[100vh] flex-with-center">
      <div className="surface-content rounded p-16 gap-16 shadow-popup">
        <div className="flex-with-center p-16 display-medium16">로그인을 하면, 이전 상담 기록을 다시 볼 수 있어요</div>
        <div>
          <Button color="kakao">
            <Icon icon="f7:chat-bubble-fill" />
            카카오로 시작하기
          </Button>
          <Button color="cancel">로그인없이 타로 볼래요</Button>
        </div>
      </div>
    </div>
  );
}
