import { useNavigate } from 'react-router-dom';

import Background from '@components/Background';
import CustomButton from '@components/CustomButton';

import { connect } from '@business/services/socket';

function HomePage() {
  const navigate = useNavigate();

  const moveAiChat = () => {
    connect();

    navigate('/chat/ai');
  };

  const moveHumanChat = () => {
    navigate('/chat/human');
  };

  return (
    <Background>
      <div className="relative top-75 flex gap-36 z-1">
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
}

export default HomePage;
