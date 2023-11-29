import type { Message } from '@components/ChatContainer';

import ChatInput from './ChatInput';
import ChatList from './ChatList';

interface ChatContainerProps {
  width: string;
  height: string;
  position?: string;
  messages: Message[];
  inputDisabled: boolean;
  onSubmitMessage: (message: string) => void;
}

function ChatContainer({ width, height, position, messages, inputDisabled, onSubmitMessage }: ChatContainerProps) {
  return (
    <div className={`${width} ${height} ${position} absolute `}>
      <ChatList messages={messages} />
      <ChatInput
        disabled={inputDisabled}
        sendChatMessage={onSubmitMessage}
      />
    </div>
  );
}

export default ChatContainer;
