import type { ButtonColor, IconColor } from '@constants/colors';
import { iconColorMap } from '@constants/colors';
import type { ButtonSize } from '@constants/sizes';

import { Icon } from '@iconify/react/dist/iconify.js';

import Button from './Button';

interface IconButtonProps {
  icon: string;
  iconSize?: number;
  iconColor?: IconColor;
  buttonSize?: ButtonSize;
  buttonColor?: ButtonColor;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function IconButton({
  icon,
  iconColor = 'textWhite',
  iconSize = 28,
  buttonSize = 'm',
  buttonColor = 'active',
  onClick,
  children,
}: IconButtonProps) {
  return (
    <Button
      size={buttonSize}
      color={buttonColor}
      onClick={onClick}
      circle={children !== undefined}
    >
      <Icon
        icon={icon}
        fontSize={iconSize}
        className={iconColorMap[iconColor]}
      />
      {children}
    </Button>
  );
}
