import { connect } from '@/socket';
import { useNavigate } from 'react-router-dom';

import CustomButton from '@components/CustomButton';

const HomePage = () => {
  const navigate = useNavigate();

  const moveAiChat = () => {
    connect();
    navigate('/chat/ai');
  };

  const moveHumanChat = () => {
    navigate('/chat/human');
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-80">
      <img
        className="absolute w-full h-full object-cover -z-10"
        src="/bg.png"
        alt="밤 하늘의 배경 이미지"
      />
      <img
        className="w-285 h-285 animate-shining"
        src="/moon.png"
        alt="빛나는 마법의 소라 고둥"
      />
      <div className="flex gap-36 mb-128 z-1">
        <CustomButton handleButtonClicked={moveAiChat}>AI에게 타로보기</CustomButton>
        <CustomButton
          handleButtonClicked={moveHumanChat}
          color="dark"
        >
          채팅방 개설하기
        </CustomButton>
      </div>
    </div>
  );
};

export default HomePage;
