import animationNames from '@constants/animation';

interface SideBarProps {
  hidden: boolean;
  children: React.ReactNode;
}

export default function SideBar({ hidden, children }: SideBarProps) {
  const animation = hidden ? animationNames.HIDE_SIDEBAR : animationNames.SHOW_SIDEBAR;

  return <aside className={`w-fit h-full pl-30 pr-30 ${animation} surface-alt relative z-30`}>{children}</aside>;
}
