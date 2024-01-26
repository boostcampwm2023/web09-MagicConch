import ContentArea from './ContentArea';
import SideBar from './SideBar';

interface ContentAreaWithSideBarProps {
  children: React.ReactNode;
  sideBar: React.ReactNode;
}

export default function ContentAreaWithSideBar({ children, sideBar }: ContentAreaWithSideBarProps) {
  return (
    <div>
      <ContentArea>{children}</ContentArea>
      <SideBar>{sideBar}</SideBar>
    </div>
  );
}
