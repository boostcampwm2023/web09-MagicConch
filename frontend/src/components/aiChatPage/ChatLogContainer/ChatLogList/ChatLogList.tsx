import { ChatLogGroup } from '.';
import { chatlogs } from '../__mocks__';

export function ChatLogList() {
  return (
    <div className="w-h-full flex flex-col gap-16">
      {chatlogs.map(({ date, logs }) => (
        <ChatLogGroup
          date={date}
          logs={logs}
        />
      ))}
    </div>
  );
}
