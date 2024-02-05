import { IconButton } from '@components/common/Buttons';

import { useSideBarButton } from '@business/hooks/sidbar';

interface SideBarButtonProps {
  activeIcon: string;
  inactiveIcon: string;
}

export function SideBarButton({ activeIcon, inactiveIcon }: SideBarButtonProps) {
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
