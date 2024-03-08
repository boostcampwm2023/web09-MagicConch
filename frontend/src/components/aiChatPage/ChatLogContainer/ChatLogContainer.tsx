import { ChatLogList } from './ChatLogList';
import { ContinueChatButton } from './ContinueChatButton';
import { useChatLogList } from './hooks';

export function ChatLogContainer() {
  const { list } = useChatLogList();

  return (
    <div className="w-h-full overflow-auto flex-with-center flex-col gap-8 p-30">
      <ContinueChatButton />
      <ChatLogList list={list} />
    </div>
  );
}
