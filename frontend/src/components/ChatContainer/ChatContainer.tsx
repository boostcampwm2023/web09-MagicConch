import { useRef } from 'react';

import ChatInput from '@components/ChatContainer/ChatInput';
import ChatList from '@components/ChatContainer/ChatList';

import { useAiChatMessage } from '@business/hooks/useAiChat';

interface ChatContainerProps {
  width: string;
  height: string;
  position?: string;
}

function ChatContainer({ width, height, position }: ChatContainerProps) {
  const tarotCardId = useRef<number>();

  // TODO: 현재 무조건 AI 채팅으로 넘어감 -> useHumanChatMessage로 변경 필요
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
