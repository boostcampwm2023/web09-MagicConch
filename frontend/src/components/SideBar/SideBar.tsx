import { useSideBarAnimation } from '@business/hooks/useSideBar';

interface SideBarProps {
  children: React.ReactNode;
}

export default function SideBar({ children }: SideBarProps) {
  const { animation } = useSideBarAnimation();

  return <aside className={`w-fit h-full pl-30 pr-30 ${animation} surface-alt relative z-30`}>{children}</aside>;
}
