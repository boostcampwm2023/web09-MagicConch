import { useSideBarStore } from '@stores/zustandStores/useSideBarStore';

import SideBar from './SideBar';

interface ContentAreaWithSideBarProps {
  children: React.ReactNode;
  sideBar: React.ReactNode;
}

export default function ContentAreaWithSideBar({ children, sideBar }: ContentAreaWithSideBarProps) {
  const { sideBarState } = useSideBarStore();

  return (
    <div className="w-screen h-full flex justify-end overflow-hidden absolute z-10">
      <div className="w-screen h-full flex">
        <article className="w-screen h-full flex justify-center">{children}</article>
        <SideBar hidden={!sideBarState}>{sideBar}</SideBar>
      </div>
    </div>
  );
}
