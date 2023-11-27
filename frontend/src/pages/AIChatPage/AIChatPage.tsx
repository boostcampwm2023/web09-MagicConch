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
      <Header />
      <ChatContainer
        width="w-700"
        height="h-3/4"
        position="top-90"
      />
    </Background>
  );
}

export default AIChatPage;
