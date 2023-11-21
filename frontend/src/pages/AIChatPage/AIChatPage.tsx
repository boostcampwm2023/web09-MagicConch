import { useRef } from 'react';

import Background from '@components/Background';
import ChatInput from '@components/ChatInput';
import ChatList from '@components/ChatList/ChatList';
import CustomButton from '@components/CustomButton';
import Header from '@components/Header';

import { useAiChatMessage, useAiChatTarot } from '@business/hooks/useAiChat';

import { Icon } from '@iconify/react';

interface AIChatPageProps {}

function AIChatPage({}: AIChatPageProps) {
  const tarotCardId = useRef<string>();

  const { askTarotCardButtons, tarotSpreadButton } = useAiChatTarot(tarotCardId);
  const { messages, messageStreaming, onSubmitMessage } = useAiChatMessage(tarotCardId);

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
        <ChatList messages={messages} />

        {/* // TODO 서버에서 AI 데이터를 받아오고 있는 동안 disabled 하기 */}
        {askTarotCardButtons}
        <ChatInput
          disabled={messageStreaming}
          sendChatMessage={onSubmitMessage}
        />
      </div>

      {tarotSpreadButton}
    </Background>
  );
}

export default AIChatPage;
