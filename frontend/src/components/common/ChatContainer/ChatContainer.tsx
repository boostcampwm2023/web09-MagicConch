import { type ForwardedRef, forwardRef } from 'react';

import type { Message } from '@components/common/ChatContainer';

import { ChatInput } from './ChatInput';
import { ChatList } from './ChatList';

interface ChatContainerProps {
  messages: Message[];
  inputDisabled: boolean;
  onSubmitMessage: (message: string) => void;
}
function ChatContainerComponent(
  { messages, inputDisabled, onSubmitMessage }: ChatContainerProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className={`relative w-h-full flex-with-center flex-col`}
    >
      <ChatList messages={messages} />
      <ChatInput
        disabled={inputDisabled}
        sendChatMessage={onSubmitMessage}
      />
    </div>
  );
}

export const ChatContainer = forwardRef(ChatContainerComponent);
