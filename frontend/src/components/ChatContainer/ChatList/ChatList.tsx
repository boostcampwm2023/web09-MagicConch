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
  tarotId?: number;
  button?: MessageButton;
  shareLinkId?: string;
}

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
      className={`w-full h-full mb-20 overflow-auto scroll-smooth sm:text-[14px]`}
    >
      {messages.map(({ type, message, profile, tarotId, button, shareLinkId }, index) => {
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
              shareLinkId={shareLinkId}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default ChatList;
