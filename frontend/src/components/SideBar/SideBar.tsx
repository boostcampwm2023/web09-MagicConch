import { PropsWithChildren, useState } from 'react';

import { CustomButton } from '@components/Buttons';

import { Icon } from '@iconify/react';

function SideBar({ children }: PropsWithChildren) {
  const [opened, setOpened] = useState(false);
  const [updated, setUpdated] = useState(false);

  const toggleOpened = () => {
    if (!updated) setUpdated(true);
    setOpened(!opened);
  };

  return (
    <>
      <CustomButton
        color="transparent"
        circle
        onClick={toggleOpened}
      >
        <Icon
          className="text-25"
          icon={`${opened ? 'carbon:side-panel-open' : 'carbon:side-panel-close'}`}
        />
      </CustomButton>
      <div
        className={`${updated && (opened ? 'animate-openingSidebar' : 'animate-closingSidebar')} 
                    surface-alt w-500 h-[calc(100vh-48px)] absolute -right-500 top-48 flex-with-center overflow-hidden`}
      >
        {children}
      </div>
    </>
  );
}

export default SideBar;
