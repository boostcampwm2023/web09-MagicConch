import { useState } from 'react';

import { CustomButton } from '@components/Buttons';
import ChatContainer from '@components/ChatContainer';

import { Icon } from '@iconify/react';

function HistorySideBar() {
  const [opened, setOpened] = useState(false);
  const toggleOpened = () => setOpened(!opened);

  return (
    <>
      <CustomButton
        color="transparent"
        circle
        onClick={toggleOpened}
      >
        <Icon
          className="text-25"
          icon={`${opened ? 'carbon:side-panel-close' : 'carbon:side-panel-open'}`}
        />
      </CustomButton>
      <div
        className={`${
          opened ? 'animate-openingSidebar' : 'animate-closingSidebar'
        } surface-alt h-screen -z-1000 absolute right-0 top-0 flex-with-center`}
      >
        <ChatContainer width="w-450" />
      </div>
    </>
  );
}

export default HistorySideBar;
