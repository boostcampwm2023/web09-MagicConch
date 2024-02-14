import { IconButton } from '@components/common/Buttons';

interface SideBarButtonProps {
  onClick?: () => void;
  sideBarOpened: boolean;
}

export function SideBarButton({ onClick, sideBarOpened }: SideBarButtonProps) {
  const toggleSideBar = () => {
    onClick?.();
  };

  return (
    <IconButton
      icon={sideBarOpened ? 'mdi:message' : 'mdi:message-off'}
      iconColor="textWeak"
      buttonColor="transparent"
      onClick={toggleSideBar}
    />
  );
}
