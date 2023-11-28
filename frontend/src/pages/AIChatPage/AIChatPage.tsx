import { useRef } from 'react';

import Background from '@components/Background';
import ChatContainer from '@components/ChatContainer';
import Header from '@components/Header';

import { useAiChatMessage, useTarotSpread } from '@business/hooks/useAiChat';

interface AIChatPageProps {}

function AIChatPage({}: AIChatPageProps) {
  const tarotCardId = useRef<number>();

  useTarotSpread(tarotCardId);
  const { messages, inputDisabled, onSubmitMessage } = useAiChatMessage(tarotCardId);

  return (
    <Background type="dynamic">
      {/* // TODO history sidebar 구현필요 */}
      <Header />
      <ChatContainer
        width="w-700"
        height="h-3/4"
        position="top-90"
        messages={messages}
        inputDisabled={inputDisabled}
        onSubmitMessage={onSubmitMessage}
      />
    </Background>
  );
}

export default AIChatPage;
