import { Button, KakaoLoginButton } from '@components/Buttons';

interface LoginPopupProps {
  moveAiChat: () => void;
}
export default function LoginPopup({ moveAiChat }: LoginPopupProps) {
  return (
    <div className="w-[100vw] h-[100vh] flex-with-center">
      <div className="flex flex-col gap-18 surface-content rounded p-24 shadow-popup">
        <div className="flex-with-center p-16 display-medium16 text-center">
          로그인을 하면
          <br />
          이전 상담 기록을 다시 볼 수 있어요
        </div>
        <div className="w-full flex-with-center flex-col gap-16">
          <KakaoLoginButton width={240} />
          <Button
            color="cancel"
            width={240}
            onClick={moveAiChat}
          >
            로그인없이 타로 볼래요
          </Button>
        </div>
      </div>
    </div>
  );
}
