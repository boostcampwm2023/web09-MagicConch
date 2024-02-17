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
      icon={sideBarOpened ? 'mdi:message-off' : 'mdi:message'}
      iconColor="textWeak"
      buttonColor="transparent"
      onClick={toggleSideBar}
    />
  );
}
