import { useNavigate } from 'react-router-dom';

import { Background } from '@components/common';
import { Button } from '@components/common/Buttons';

import { useLoginPopup } from '@business/hooks/popup';

import { useReset } from './hooks';

export function HomePage() {
  const navigate = useNavigate();
  useReset();

  const moveAiChat = () => navigate('/chat/ai');

  const { openLoginPopup } = useLoginPopup({ moveAiChat });

  const moveHumanChat = () => {
    navigate('/chat/human', { state: { host: true } });
  };

  return (
    <>
      <Background themeButton />
      <main className="w-screen h-dvh relative flex-with-center z-1">
        <div className="flex gap-36 mt-150">
          <Button onClick={openLoginPopup}>AI에게 타로보기</Button>
          <Button
            onClick={moveHumanChat}
            color="dark"
          >
            채팅방 개설하기
          </Button>
        </div>
      </main>
    </>
  );
}
