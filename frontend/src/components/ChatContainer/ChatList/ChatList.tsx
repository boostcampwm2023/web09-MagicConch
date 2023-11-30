import MessageBox from '../MessageBox';
import { useEffect, useRef } from 'react';

import type { Message } from '@components/ChatContainer';

interface ChatListProps {
  size?: string;
  messages: Message[];
}

function ChatList({ messages }: ChatListProps) {
  const messagesRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    messagesRef.current!.scrollTop = messagesRef.current!.scrollHeight;
  }, [messages]);

  return (
    <ul
      ref={messagesRef}
      className={`w-full h-full mb-20 overflow-auto scroll-smooth sm:text-12`}
    >
      {messages.map(({ type, message, profile, tarotId, button, shareLinkId }, index) => {
        return (
          <li
            key={new Date().getTime() + index}
            className={`flex ${message && 'mb-40'} ${type == 'right' && 'justify-end'}`}
          >
            <MessageBox
              tarotId={tarotId}
              type={type}
              message={message}
              profile={profile}
              button={button}
              shareLinkId={shareLinkId}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default ChatList;
