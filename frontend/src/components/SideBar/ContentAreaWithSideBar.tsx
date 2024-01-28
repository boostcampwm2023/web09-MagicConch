import ContentArea from './ContentArea';
import SideBar from './SideBar';

interface ContentAreaWithSideBarProps {
  children: React.ReactNode;
  sideBar: React.ReactNode;
}

export default function ContentAreaWithSideBar({ children, sideBar }: ContentAreaWithSideBarProps) {
  return (
    <div className="w-screen h-full flex justify-end overflow-hidden">
      <div className="w-screen h-full flex">
        <ContentArea>{children}</ContentArea>
        <SideBar>{sideBar}</SideBar>
      </div>
    </div>
  );
}
