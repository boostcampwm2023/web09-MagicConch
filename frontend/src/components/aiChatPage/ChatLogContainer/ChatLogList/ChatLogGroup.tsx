import { ChatLogItem } from './ChatLogItem';

interface ChatLogGroupProps {
  date: string;
  rooms: {
    id: string;
    title: string;
    createdAt: string;
  }[];
}

export function ChatLogGroup({ date, rooms }: ChatLogGroupProps) {
  return (
    <ul className="flex flex-col gap-12">
      {date}
      {rooms.map(({ id, title }) => (
        <ChatLogItem
          key={id}
          id={id}
          title={title}
        />
      ))}
    </ul>
  );
}
