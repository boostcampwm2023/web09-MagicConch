interface ChatLogItemProps {
  log: string;
}

function ChatLogItem({ log }: ChatLogItemProps) {
  return <li className="w-full h-24 display-medium12 text-white">{log}</li>;
}

export default ChatLogItem;
