import { useRef } from 'react';

import ChatInput from '@components/ChatContainer/ChatInput';
import ChatList from '@components/ChatContainer/ChatList';

import { useAiChatMessage } from '@business/hooks/useAiChat';

interface ChatContainerProps {
  width: string;
  height: string;
  position: string;
}

function ChatContainer({ width, height, position }: ChatContainerProps) {
  const tarotCardId = useRef<number>();
  const { messages, inputDisabled, onSubmitMessage } = useAiChatMessage(tarotCardId);

  return (
    <div className={`${width} ${height} ${position} absolute`}>
      <ChatList messages={messages} />
      <ChatInput
        disabled={inputDisabled}
        sendChatMessage={onSubmitMessage}
      />
    </div>
  );
}

export default ChatContainer;
