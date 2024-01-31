import { useState } from 'react';

import { IconButton } from '@components/Buttons';

interface ChatLogItemProps {
  log: string;
}

function ChatLogItem({ log }: ChatLogItemProps) {
  const [hovered, setHovered] = useState(false);
  const hoveredClass = 'surface-default';

  const handleMouseOver = () => {
    setHovered(true);
  };

  const handleMouseOut = () => {
    setHovered(false);
  };

  return (
    <li
      className={`w-full h-30 display-medium14 text-white p-5 rounded-lg flex justify-between items-center ${
        hovered ? hoveredClass : ''
      }`}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {log}
      {hovered && (
        <div className="flex">
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
      )}
    </li>
  );
}

export default ChatLogItem;
