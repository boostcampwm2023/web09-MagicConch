import { ChatLogGroup } from '.';

import { ChatLogListResponse } from '@stores/queries';

interface ChatLogListProps {
  list: ChatLogListResponse;
}

export function ChatLogList({ list }: ChatLogListProps) {
  return (
    <div className="w-h-full flex flex-col gap-16">
      {list.map(({ date, rooms }) => (
        <ChatLogGroup
          key={date}
          date={date}
          rooms={rooms}
        />
      ))}
    </div>
  );
}
