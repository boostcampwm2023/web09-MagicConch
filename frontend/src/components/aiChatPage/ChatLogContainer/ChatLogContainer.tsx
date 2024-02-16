import { ChatLogList, NewChatLogButton } from '.';

export function ChatLogContainer() {
  return (
    <div className="w-full pt-64 flex-with-center flex-col gap-8 pl-30 pr-30">
      <NewChatLogButton />
      <ChatLogList />
    </div>
  );
}
