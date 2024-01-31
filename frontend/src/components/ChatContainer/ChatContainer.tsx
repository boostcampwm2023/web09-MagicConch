import type { Message } from '@components/ChatContainer';

import ChatInput from './ChatInput';
import ChatList from './ChatList';

interface ChatContainerProps {
  width: string;
  height: string;
  messages: Message[];
  inputDisabled: boolean;
  onSubmitMessage: (message: string) => void;
}

function ChatContainer({ width, height, messages, inputDisabled, onSubmitMessage }: ChatContainerProps) {
  return (
    <div className={`${width} ${height} flex-with-center flex-col`}>
      <ChatList messages={messages} />
      <ChatInput
        disabled={inputDisabled}
        sendChatMessage={onSubmitMessage}
      />
    </div>
  );
}

export default ChatContainer;
