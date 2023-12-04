import { useState } from 'react';

import Background from '@components/Background';
import ChatContainer from '@components/ChatContainer';
import Header from '@components/Header';

import { useAiChatMessage, useAiTarotSpread } from '@business/hooks/useAiChat';

interface AIChatPageProps {}

function AIChatPage({}: AIChatPageProps) {
  const [tarotId, setTarotId] = useState<number>();

  const { messages, inputDisabled, onSubmitMessage } = useAiChatMessage(tarotId, setTarotId);
  useAiTarotSpread(setTarotId);

  return (
    <Background type="dynamic">
      {/* // TODO history sidebar 구현필요 */}
      <Header />
      <ChatContainer
        width="w-[80vw] max-w-700"
        height="h-[75vh]"
        position="top-[10vh]"
        messages={messages}
        inputDisabled={inputDisabled}
        onSubmitMessage={onSubmitMessage}
      />
    </Background>
  );
}

export default AIChatPage;
