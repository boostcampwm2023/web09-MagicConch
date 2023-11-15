import CustomButton from '@/components/CustomButton';
import Header from '@/components/Header';
import MessageBox from '@/components/MessageBox/MessageBox';
import { Icon } from '@iconify/react';

interface AIChatPageProps {}

const AIChatPage = ({}: AIChatPageProps) => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-80">
      <img
        className="absolute w-full h-full object-cover -z-10"
        src="/bg.png"
        alt="밤 하늘의 배경 이미지"
      />
      <img
        className="w-285 h-285 relative bottom-130"
        src="/moon.png"
        alt="빛나는 마법의 소라 고둥"
      />
      <div className="absolute w-full h-full bg-black/80 animate-fadeIn" />
      <Header
        rightItems={[
          <CustomButton
            color="transparent"
            size="s"
            key="side-panel-close"
          >
            <Icon
              className="w-22 h-22"
              icon="carbon:side-panel-close"
            />
          </CustomButton>,
        ]}
      />
    </div>
  );
};

export default AIChatPage;
