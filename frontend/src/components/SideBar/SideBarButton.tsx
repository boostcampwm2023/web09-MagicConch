import { IconButton } from '@components/Buttons';

import { useSideBarButton } from '@business/hooks/useSideBar';

interface SideBarButtonProps {
  activeIcon: string;
  inactiveIcon: string;
}

export default function SideBarButton({ activeIcon, inactiveIcon }: SideBarButtonProps) {
  const { sideBarState, handleClick, buttonDisabled } = useSideBarButton();

  if (buttonDisabled) {
    return undefined;
  }

  const icon = sideBarState ? inactiveIcon : activeIcon;

  return (
    <IconButton
      icon={icon}
      iconColor="textWeak"
      buttonColor="transparent"
      onClick={handleClick}
    />
  );
}
