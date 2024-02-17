import { SideBar } from '.';

interface ContentAreaWithSideBarProps {
  children: React.ReactNode;
  sideBar: React.ReactNode;
}

export function ContentAreaWithSideBar({ children, sideBar }: ContentAreaWithSideBarProps) {
  return (
    <div className="w-screen h-full flex justify-end overflow-hidden absolute z-10">
      <div className="w-screen h-full flex">
        <article className="w-screen h-full flex justify-center">{children}</article>
        <SideBar>{sideBar}</SideBar>
      </div>
    </div>
  );
}
