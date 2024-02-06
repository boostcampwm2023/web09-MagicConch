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
      className={`w-[90%] h-[80%] pt-50 mb-20 overflow-auto sm:text-12`}
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
