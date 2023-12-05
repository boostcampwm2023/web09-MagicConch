import type { ButtonColor, IconColor } from '@constants/colors';
import type { ButtonSize } from '@constants/sizes';

import IconButton from './IconButton';

interface IconToggleButtonProps {
  activeIcon: string;
  inactiveIcon: string;
  iconColor?: IconColor;
  iconSize?: number;
  buttonActiveColor?: ButtonColor;
  buttonInactiveColor?: ButtonColor;
  buttonSize?: ButtonSize;
  onClick?: () => void;
  active: boolean;
}

export default function IconToggleButton({
  activeIcon,
  inactiveIcon,
  iconColor = 'textWhite',
  iconSize,
  buttonActiveColor = 'active',
  buttonInactiveColor = 'cancel',
  buttonSize,
  onClick,
  active,
}: IconToggleButtonProps) {
  return (
    <IconButton
      icon={active ? activeIcon : inactiveIcon}
      iconSize={iconSize}
      iconColor={iconColor}
      buttonSize={buttonSize}
      buttonColor={active ? buttonActiveColor : buttonInactiveColor}
      onClick={onClick}
    />
  );
}
