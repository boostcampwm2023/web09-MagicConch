import { getChatLogListQuery } from '@stores/queries/getChatLogListQuery';

import { ChatLogList } from './ChatLogList';
import { ContinueChatButton } from './ContinueChatButton';

export function ChatLogContainer() {
  const { data } = getChatLogListQuery();

  return (
    <div className="w-h-full overflow-auto pt-64 flex-with-center flex-col gap-8">
      <ContinueChatButton />
      <ChatLogList list={data ?? []} />
    </div>
  );
}
