import { getChatLogListQuery } from '@stores/queries/getChatLogListQuery';

import { ChatLogList } from './ChatLogList';
import { NewChatButton } from './NewChatButton';

export function ChatLogContainer() {
  const { data } = getChatLogListQuery();

  return (
    <div className="w-h-full overflow-auto pt-90 flex-with-center flex-col gap-8">
      <NewChatButton />
      <ChatLogList list={data ?? []} />
    </div>
  );
}
