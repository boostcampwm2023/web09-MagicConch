import { type ForwardedRef, forwardRef } from 'react';

import type { Message } from '@components/common/ChatContainer';

import { ChatInput } from './ChatInput';
import { ChatList } from './ChatList';

interface ChatContainerProps {
  width: string;
  height: string;
  messages: Message[];
  inputDisabled: boolean;
  onSubmitMessage: (message: string) => void;
}
function ChatContainerComponent(
  { width, height, messages, inputDisabled, onSubmitMessage }: ChatContainerProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className={`${width} ${height} flex-with-center flex-col absolute`}
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
