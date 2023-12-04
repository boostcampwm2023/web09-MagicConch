import { useEffect, useState } from 'react';

import { CustomButton } from '@components/Buttons';

import { Icon } from '@iconify/react';

interface IconType {
  open: string;
  close: string;
}
interface SideBarProps {
  icon: IconType;
  onSide?: (showed: boolean) => void;
  children: React.ReactNode;
}

function SideBar({ onSide, children, icon }: SideBarProps) {
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
      <CustomButton
        color="transparent"
        circle
        onClick={toggleOpened}
      >
        <Icon
          className="text-25"
          icon={`${opened ? icon.open : icon.close}`}
        />
      </CustomButton>
      <div
        className={`${!hidden && (opened ? 'animate-openingSidebar' : 'animate-closingSidebar')}
                    surface-alt w-[100vw] lg:w-500 h-[calc(100vh-48px)] absolute -right-[100%] top-48 flex-with-center overflow-hidden`}
      >
        {children}
      </div>
    </>
  );
}

export default SideBar;
