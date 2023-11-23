import { useRef } from 'react';

import Background from '@components/Background';
import { CustomButton } from '@components/Buttons';
import ChatInput from '@components/ChatInput';
import ChatList from '@components/ChatList';
import Header from '@components/Header';

import { useAiChatMessage, useTarotSpread } from '@business/hooks/useAiChat';

import { Icon } from '@iconify/react';

interface AIChatPageProps {}

function AIChatPage({}: AIChatPageProps) {
  const tarotCardId = useRef<number>();

  useTarotSpread(tarotCardId);
  const { messages, inputDisabled, onSubmitMessage } = useAiChatMessage(tarotCardId);

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
        <ChatInput
          disabled={inputDisabled}
          sendChatMessage={onSubmitMessage}
        />
      </div>
    </Background>
  );
}

export default AIChatPage;
