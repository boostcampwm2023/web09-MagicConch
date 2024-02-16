import { useNavigate } from 'react-router-dom';

import { Background } from '@components/common';
import { Button } from '@components/common/Buttons';

import { useLoginPopup } from '@business/hooks/popup';

export function HomePage() {
  const navigate = useNavigate();

  const moveAiChat = () => navigate('/chat/ai');

  const { openLoginPopup } = useLoginPopup({ moveAiChat });

  const moveHumanChat = () => {
    navigate('/chat/human', { state: { host: true } });
  };

  return (
    <>
      <Background />
      <main className="w-screen h-dvh relative flex-with-center gap-36 z-1">
        <Button onClick={openLoginPopup}>AI에게 타로보기</Button>
        <Button
          onClick={moveHumanChat}
          color="dark"
        >
          채팅방 개설하기
        </Button>
      </main>
    </>
  );
}
