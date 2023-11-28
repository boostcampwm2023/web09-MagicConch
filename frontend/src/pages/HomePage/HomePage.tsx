import { useNavigate } from 'react-router-dom';

import Background from '@components/Background';
import { CustomButton } from '@components/Buttons';

import { useSocket } from '@business/hooks/useSocket';

function HomePage() {
  const navigate = useNavigate();
  const { connectSocket } = useSocket('AIChat');

  const moveAiChat = () => {
    connectSocket(import.meta.env.VITE_WAS_URL, { reconnect: true });
    navigate('/chat/ai');
  };

  const moveHumanChat = () => {
    connectSocket(import.meta.env.VITE_HUMAN_SOCKET_URL);
    // TODO: 실제 room id를 받아와야 함
    navigate('/chat/human/1/setting');
  };

  return (
    <Background>
      <div className="relative top-75 flex gap-36 z-1">
        <CustomButton
          size="m"
          onClick={moveAiChat}
        >
          AI에게 타로보기
        </CustomButton>
        <CustomButton
          onClick={moveHumanChat}
          size="m"
          color="dark"
        >
          채팅방 개설하기
        </CustomButton>
      </div>
    </Background>
  );
}

export default HomePage;
