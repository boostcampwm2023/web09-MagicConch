import { IconButton } from '@components/common';

interface ChatLogItemProps {
  title: string;
}

export function ChatLogItem({ title }: ChatLogItemProps) {
  return (
    <li className="group w-full h-30 display-medium14 text-white p-5 rounded-lg flex justify-between items-center hover:surface-default">
      {title}
      <div className="hidden group-hover:flex">
        <IconButton
          icon="ic:outline-edit"
          size="s"
          buttonColor="transparent"
        />
        <IconButton
          icon="material-symbols:delete"
          size="s"
          buttonColor="transparent"
        />
      </div>
    </li>
  );
}
