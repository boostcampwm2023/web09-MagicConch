import Background from '@components/Background';
import ChatContainer from '@components/ChatContainer';
import Header from '@components/Header';

import { useAiChatMessage } from '@business/hooks/useChatMessage';
import { useAiTarotSpread } from '@business/hooks/useTarotSpread';

interface AIChatPageProps {}

function AIChatPage({}: AIChatPageProps) {
  const { messages, inputDisabled, onSubmitMessage, addPickCardMessage } = useAiChatMessage();
  useAiTarotSpread(addPickCardMessage);

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
