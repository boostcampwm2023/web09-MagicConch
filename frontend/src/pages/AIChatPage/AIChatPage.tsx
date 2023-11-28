import { useRef } from 'react';

import Background from '@components/Background';
import ChatContainer from '@components/ChatContainer';
import Header from '@components/Header';

import { useTarotSpread } from '@business/hooks/useAiChat';

interface AIChatPageProps {}

function AIChatPage({}: AIChatPageProps) {
  const tarotCardId = useRef<number>();

  useTarotSpread(tarotCardId);

  return (
    <Background type="dynamic">
      {/* // TODO history sidebar 구현필요 */}
      <Header />
      <ChatContainer
        width="w-[80vw] max-w-700"
        height="h-[75vh]"
        position="top-[10vh]"
      />
    </Background>
  );
}

export default AIChatPage;
