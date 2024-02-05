import { useNavigate } from 'react-router-dom';

import Background from '@components/Background';
import { Button } from '@components/Buttons';

import { useLoginPopup } from '@business/hooks/usePopup/useLoginPopup';

function HomePage() {
  const navigate = useNavigate();

  const moveAiChat = () => navigate('/chat/ai');

  const { openLoginPopup } = useLoginPopup({ moveAiChat });

  const moveHumanChat = () => {
    navigate('/chat/human', { state: { host: true } });
  };

  return (
    <Background>
      <div className="relative top-75 flex gap-36 z-1">
        <Button onClick={openLoginPopup}>AI에게 타로보기</Button>
        <Button
          onClick={moveHumanChat}
          color="dark"
        >
          채팅방 개설하기
        </Button>
      </div>
    </Background>
  );
}

export default HomePage;
