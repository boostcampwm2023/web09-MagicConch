import ChatLogList from './ChatLogList';
import NewChatLogButton from './NewChatButton';

function ChatLogContainer() {
  return (
    <div className="w-240 pt-64 flex-with-center flex-col gap-8">
      <NewChatLogButton />
      <ChatLogList />
    </div>
  );
}

export default ChatLogContainer;
