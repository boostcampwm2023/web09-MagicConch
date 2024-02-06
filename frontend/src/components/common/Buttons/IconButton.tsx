import { Button } from '.';

import type { ButtonColor, IconColor } from '@constants/colors';
import { iconColorMap } from '@constants/colors';
import type { ButtonSize } from '@constants/sizes';
import { iconSizeMap } from '@constants/sizes';

import { Icon } from '@iconify/react';

interface IconButtonProps {
  icon: string;
  iconColor?: IconColor;
  size?: ButtonSize;
  buttonColor?: ButtonColor;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function IconButton({
  icon,
  iconColor = 'textWhite',
  size = 'm',
  buttonColor = 'active',
  disabled = false,
  onClick,
  children,
}: IconButtonProps) {
  return (
    <Button
      size={size}
      color={buttonColor}
      onClick={onClick}
      disabled={disabled}
      circle={children === undefined}
    >
      <Icon
        icon={icon}
        fontSize={iconSizeMap[size]}
        className={iconColorMap[iconColor]}
      />
      {children}
    </Button>
  );
}
