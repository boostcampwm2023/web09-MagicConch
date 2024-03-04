import { MessageBox } from '../MessageBox';
import type { Message } from '../types';
import { useEffect, useRef } from 'react';

interface ChatListProps {
  size?: string;
  messages: Message[];
}

export function ChatList({ messages }: ChatListProps) {
  const messagesRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    messagesRef.current!.scrollTop = messagesRef.current!.scrollHeight;
  }, [messages]);

  return (
    <ul
      ref={messagesRef}
      className={`w-h-full overflow-auto sm:text-12 justify-center items-center`}
    >
      {messages.map(({ type, message, profile, tarotId, button, shareLinkId }, index) => {
        return (
          <li
            key={new Date().getTime() + index}
            className={`flex ${message && 'mb-20'} ${type == 'right' && 'justify-end'} ${index === 0 && 'mt-30'}`}
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
