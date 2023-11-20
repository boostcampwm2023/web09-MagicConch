import { Icon } from '@iconify/react';

import Background from '@components/Background';
import ChatInput from '@components/ChatInput';
import ChatList from '@components/ChatList/ChatList';
import CustomButton from '@components/CustomButton';
import Header from '@components/Header';

import { useAiChat } from '@business/hooks/useAiChat';

interface AIChatPageProps {}

function AIChatPage({}: AIChatPageProps) {
  const { messages, messageStreaming, onSubmitMessage } = useAiChat();

  return (
    <Background type="dynamic">
      <Header
        rightItems={[
          <CustomButton
            color="transparent"
            circle
            key="side-panel-close"
          >
            <Icon
              className="text-25"
              icon="carbon:side-panel-close"
            />
          </CustomButton>,
        ]}
      />

      <div className="w-700 absolute top-95 h-3/4">
        {/* TEST */}
        <ChatList messages={messages} />

        {/* // TODO 서버에서 AI 데이터를 받아오고 있는 동안 disabled 하기 */}
        <ChatInput
          disabled={messageStreaming}
          sendChatMessage={onSubmitMessage}
        />
      </div>
    </Background>
  );
}

export default AIChatPage;
