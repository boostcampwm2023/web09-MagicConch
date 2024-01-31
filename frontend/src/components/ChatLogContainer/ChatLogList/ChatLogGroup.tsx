import ChatLogItem from './ChatLogItem';

interface ChatLogGroupProps {
  date: string;
  logs: string[];
}

function ChatLogGroup({ date, logs }: ChatLogGroupProps) {
  return (
    <ul className="flex flex-col gap-12">
      <header className="display-medium14 text-weak">{date}</header>
      {logs.map(log => (
        <ChatLogItem log={log} />
      ))}
    </ul>
  );
}

export default ChatLogGroup;
