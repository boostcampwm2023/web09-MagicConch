import { Icon } from '@iconify/react';

import ChatInput from '@components/ChatInput';
import ChatList from '@components/ChatList/ChatList';
import CustomButton from '@components/CustomButton';
import Header from '@components/Header';

import { sendMessage } from '@business/services/socket';

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

      {/* TEST */}
      <ChatList
        messages={[
          { type: 'left', message: '안녕 만나서 반가워 친구야' },
          {
            type: 'right',
            message:
              '고민이 있는데 들어주겠니? 배가너무 고픈데 뭘 먹어야할지 모르겠어. 답을 알려줘 마법의 소라고둥!고민이 있는데 들어주겠니? 배가너무 고픈데 뭘 먹어야할지 모르겠어. 답을 알려줘 마법의 소라고둥!',
          },
          {
            type: 'left',
            message: '사케동은 어때?? 담백하고 부드러워서 언제먹어도 질리지 않아!',
          },
        ]}
      />

      {/* // TODO 서버에서 AI 데이터를 받아오고 있는 동안 disabled 하기 */}
      <ChatInput
        disabled={false}
        sendChatMessage={message => {
          // TODO: 서버로 메시지 전송 & 화면에 메시지 컴포넌트 그리기
          sendMessage(message);
        }}
      />
    </div>
  );
};

export default AIChatPage;
