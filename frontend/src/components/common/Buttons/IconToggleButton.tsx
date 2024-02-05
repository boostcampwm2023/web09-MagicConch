import { IconButton } from '.';

import type { ButtonColor, IconColor } from '@constants/colors';
import type { ButtonSize } from '@constants/sizes';

interface IconToggleButtonProps {
  activeIcon: string;
  inactiveIcon: string;
  iconColor?: IconColor;
  size?: ButtonSize;
  buttonActiveColor?: ButtonColor;
  buttonInactiveColor?: ButtonColor;
  onClick?: () => void;
  active: boolean;
}

export function IconToggleButton({
  activeIcon,
  inactiveIcon,
  iconColor = 'textWhite',
  buttonActiveColor = 'active',
  buttonInactiveColor = 'cancel',
  size = 'm',
  onClick,
  active,
}: IconToggleButtonProps) {
  return (
    <IconButton
      icon={active ? activeIcon : inactiveIcon}
      size={size}
      iconColor={iconColor}
      buttonColor={active ? buttonActiveColor : buttonInactiveColor}
      onClick={onClick}
    />
  );
}
