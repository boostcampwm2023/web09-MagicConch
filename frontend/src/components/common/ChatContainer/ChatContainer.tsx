import type { Message } from '@components/common/ChatContainer';

import { ChatInput } from './ChatInput';
import { ChatList } from './ChatList';

interface ChatContainerProps {
  messages: Message[];
  inputDisabled: boolean;
  onSubmitMessage: (message: string) => void;
}
export function ChatContainer({ messages, inputDisabled, onSubmitMessage }: ChatContainerProps) {
  return (
    <div className={`relative w-h-full flex-with-center flex-col pl-[5%] pr-[5%]`}>
      <ChatList messages={messages} />
      <ChatInput
        disabled={inputDisabled}
        sendChatMessage={onSubmitMessage}
      />
    </div>
  );
}
