import ChatLogItem from './ChatLogItem';

interface ChatLogGroupProps {
  date: string;
  logs: string[];
}

function ChatLogGroup({ date, logs }: ChatLogGroupProps) {
  return (
    <ul className="flex flex-col gap-8">
      <header className="display-medium12 text-weak">{date}</header>
      {logs.map(log => (
        <ChatLogItem log={log} />
      ))}
    </ul>
  );
}

export default ChatLogGroup;
