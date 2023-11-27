import { PropsWithChildren, useEffect, useState } from 'react';

import { CustomButton } from '@components/Buttons';

import { Icon } from '@iconify/react';

function SideBar({ children }: PropsWithChildren) {
  const [hidden, setHidden] = useState(true);
  const [opened, setOpened] = useState(false);
  const [animating, setAnimating] = useState(false);

  const toggleOpened = () => {
    if (!animating) setOpened(!opened);
    if (hidden) setHidden(false);
  };

  useEffect(() => {
    addEventListener('animationstart', () => setAnimating(true));
    addEventListener('animationend', () => setAnimating(false));

    return () => {
      removeEventListener('animationstart', () => setAnimating(true));
      removeEventListener('animationend', () => setAnimating(false));
    };
  }, []);

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
        className={`${!hidden && (opened ? 'animate-openingSidebar' : 'animate-closingSidebar')}
                    surface-alt w-500 h-[calc(100vh-48px)] absolute -right-500 top-48 flex-with-center overflow-hidden`}
      >
        {children}
      </div>
    </>
  );
}

export default SideBar;
