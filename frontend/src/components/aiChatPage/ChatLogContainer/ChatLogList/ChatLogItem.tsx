// import { IconButton } from '@components/common';
import { useAiChatLogId } from '@stores/zustandStores';

interface ChatLogItemProps {
  id: string;
  title: string;
}

export function ChatLogItem({ id, title }: ChatLogItemProps) {
  const { setId } = useAiChatLogId();

  const handleClick = () => {
    setId(id);
  };

  return (
    <li
      className="group w-full h-30 display-medium14 text-white p-5 rounded-lg flex justify-between items-center hover:surface-default"
      onClick={handleClick}
    >
      {title}
      {/* <div className="hidden group-hover:flex">
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
      </div> */}
    </li>
  );
}
