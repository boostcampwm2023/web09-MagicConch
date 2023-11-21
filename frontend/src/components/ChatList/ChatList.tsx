import MessageBox from '../MessageBox';
import { useEffect, useRef } from 'react';

export interface MessageButton {
  content: string;
  onClick: () => void;
}

export interface Message {
  type: 'left' | 'right';
  message: string;
  profile: string;
  tarotId?: string;
  button?: MessageButton;
}

interface ChatListProps {
  size?: string;
  messages: Message[];
}

// TODO: tarotId 올바르게 교체
function ChatList({ messages }: ChatListProps) {
  const messagesRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    messagesRef.current!.scrollTop = messagesRef.current!.scrollHeight;
  }, [messages]);

  return (
    <ul
      ref={messagesRef}
      className={`w-full h-full mb-20 overflow-auto scroll-smooth`}
    >
      {messages.map(({ type, message, profile, tarotId, button }, index) => {
        return (
          <li
            key={new Date().getTime() + index}
            className={`flex pr-20 ${index != 0 && 'mt-40'} ${type == 'right' && 'justify-end'}`}
          >
            <MessageBox
              tarotId={index == 0 ? undefined : tarotId}
              type={type}
              message={message}
              profile={profile}
              button={button}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default ChatList;
