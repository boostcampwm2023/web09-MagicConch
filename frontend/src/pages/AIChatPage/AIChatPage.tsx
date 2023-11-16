import ChatInput from '@/components/ChatInput';
import CustomButton from '@/components/CustomButton';
import Header from '@/components/Header';
import MessageBox from '@/components/MessageBox';
import { Icon } from '@iconify/react';

interface AIChatPageProps {}

const messageTest =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ";

const AIChatPage = ({}: AIChatPageProps) => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-80">
      <img
        className="absolute w-full h-full object-cover -z-10"
        src="/bg.png"
        alt="밤 하늘의 배경 이미지"
      />
      <img
        className="w-285 h-285 animate-shining relative bottom-130"
        src="/moon.png"
        alt="빛나는 마법의 소라 고둥"
      />
      <div className="absolute w-full h-full bg-black/75 animate-fadeIn" />
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
      {/* 테스트용 임시 ul */}
      <ul className="absolute w-760 m-auto">
        <li>
          <MessageBox
            type="left"
            message={messageTest}
          />
        </li>
        <li>
          <MessageBox
            type="right"
            message={messageTest}
          />
        </li>
      </ul>
      {/* // TODO 서버에서 AI 데이터를 받아오고 있는 동안 disabled 하기 */}
      <ChatInput
        disabled={false}
        sendChatMessage={message => {
          // TODO: 서버로 메시지 전송 & 화면에 메시지 컴포넌트 그리기
          console.log(message);
        }}
      />
    </div>
  );
};

export default AIChatPage;
