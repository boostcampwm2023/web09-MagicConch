import { useEffect, useState } from 'react';

import { IconToggleButton } from '@components/Buttons';

interface SideBarProps {
  onSide?: (showed: boolean) => void;
  children: React.ReactNode;
}

function SideBar({ onSide, children }: SideBarProps) {
  const [hidden, setHidden] = useState(true);
  const [opened, setOpened] = useState(false);
  const [animating, setAnimating] = useState(false);

  const toggleOpened = () => {
    if (!animating) setOpened(!opened);
    if (hidden) setHidden(false);

    onSide?.(!opened);
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
      <IconToggleButton
        activeIcon="carbon:side-panel-open"
        inactiveIcon="carbon:side-panel-close"
        active={opened}
        iconColor="textWeak"
        buttonActiveColor="transparent"
        buttonInactiveColor="transparent"
        onClick={toggleOpened}
      />
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
