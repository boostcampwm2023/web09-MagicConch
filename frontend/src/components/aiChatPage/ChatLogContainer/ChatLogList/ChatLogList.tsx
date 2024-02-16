import { ChatLogListResponse } from '@stores/queries/getChatLogListQuery';

import { ChatLogItem } from './ChatLogItem';

interface ChatLogListProps {
  list: ChatLogListResponse;
}

export function ChatLogList({ list }: ChatLogListProps) {
  return (
    <div className="w-h-full flex flex-col gap-16">
      {list.map(({ id, title }) => (
        <ChatLogItem
          key={id}
          id={id}
          title={title}
        />
      ))}
    </div>
  );
}
