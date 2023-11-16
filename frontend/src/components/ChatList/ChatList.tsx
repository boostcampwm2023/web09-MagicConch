import MessageBox from '../MessageBox';

export interface Message {
  type: 'left' | 'right';
  message: string;
  profile?: string;
}

interface ChatListProps {
  size?: string;
  messages: Message[];
}

function ChatList({ size = '760', messages }: ChatListProps) {
  return (
    <ul className={`absolute w-${size} h-3/4 overflow-auto`}>
      {messages.map(({ type, message, profile }) => (
        <li
          key={`${type}-${message}`}
          className={`flex pr-20 pb-40 ${type == 'right' && 'justify-end'}`}
        >
          <MessageBox
            type={type}
            message={message}
            profile={profile}
          />
        </li>
      ))}
    </ul>
  );
}

export default ChatList;
