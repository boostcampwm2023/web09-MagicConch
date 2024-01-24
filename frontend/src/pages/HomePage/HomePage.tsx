import { useNavigate } from 'react-router-dom';

import Background from '@components/Background';
import { Button, KakaoLoginButton } from '@components/Buttons';

import { useLoginPopup } from '@business/hooks/usePopup/useLoginPopup';

function HomePage() {
  const navigate = useNavigate();
  const { openLoginPopup } = useLoginPopup();

  const moveAiChat = () => {
    // navigate('/chat/ai');
    openLoginPopup();
  };

  const moveHumanChat = () => {
    navigate('/chat/human', { state: { host: true } });
  };

  return (
    <Background>
      <div>
        <KakaoLoginButton />
        <div className="relative top-75 flex gap-36 z-1">
          <Button onClick={moveAiChat}>AI에게 타로보기</Button>
          <Button
            onClick={moveHumanChat}
            color="dark"
          >
            채팅방 개설하기
          </Button>
        </div>
      </div>
    </Background>
  );
}

export default HomePage;
