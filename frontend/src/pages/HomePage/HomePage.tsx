import { useNavigate } from 'react-router-dom';

import Background from '@components/Background';
import CustomButton from '@components/CustomButton';

import { connect, setMessageEventListener } from '@business/services/socket';

const HomePage = () => {
  const navigate = useNavigate();

  const moveAiChat = () => {
    connect();

    // 테스트를 위한 부분
    setMessageEventListener(message => alert(message));
    navigate('/chat/ai');
  };

  const moveHumanChat = () => {
    navigate('/chat/human');
  };

  return (
    <Background>
      <div className="flex gap-36 mb-128 z-1">
        <CustomButton handleButtonClicked={moveAiChat}>AI에게 타로보기</CustomButton>
        <CustomButton
          handleButtonClicked={moveHumanChat}
          color="dark"
        >
          채팅방 개설하기
        </CustomButton>
      </div>
    </Background>
  );
};

export default HomePage;
