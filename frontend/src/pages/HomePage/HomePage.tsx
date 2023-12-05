import { useNavigate } from 'react-router-dom';

import Background from '@components/Background';
import { Button } from '@components/Buttons';

function HomePage() {
  const navigate = useNavigate();

  const moveAiChat = () => {
    navigate('/chat/ai');
  };

  const moveHumanChat = () => {
    navigate('/chat/human', { state: { host: true } });
  };

  return (
    <Background>
      <div className="relative top-75 flex gap-36 z-1">
        <Button
          size="m"
          onClick={moveAiChat}
        >
          AI에게 타로보기
        </Button>
        <Button
          onClick={moveHumanChat}
          size="m"
          color="dark"
        >
          채팅방 개설하기
        </Button>
      </div>
    </Background>
  );
}

export default HomePage;
