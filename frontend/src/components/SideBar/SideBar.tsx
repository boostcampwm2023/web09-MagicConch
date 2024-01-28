import { useRef } from 'react';

import animationNames from '@constants/animation';

interface SideBarProps {
  hidden: boolean;
  children: React.ReactNode;
}

export default function SideBar({ hidden, children }: SideBarProps) {
  const ref = useRef<HTMLDivElement>(null);

  const animation = hidden ? animationNames.HIDE_SIDEBAR : animationNames.SHOW_SIDEBAR;

  return (
    <aside
      ref={ref}
      className={`w-fit h-full ${animation}`}
    >
      {children}
    </aside>
  );
}
