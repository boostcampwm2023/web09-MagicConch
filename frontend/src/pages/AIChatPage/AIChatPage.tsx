import CustomButton from '@/components/CustomButton';
import Header from '@/components/Header';
import { Icon } from '@iconify/react/dist/iconify.js';

interface AIChatPageProps {}

const AIChatPage = ({}: AIChatPageProps) => {
  return (
    <div className="w-screen h-screen">
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
      <img
        className="absolute w-full h-full object-cover -z-10"
        src="/bgConch.png"
        alt="밤 하늘의 배경 이미지"
      />
      <div className="w-full h-full bg-black/70" />
    </div>
  );
};

export default AIChatPage;
