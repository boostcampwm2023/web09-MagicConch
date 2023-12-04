import { IconColor, iconColors } from '@constants/colors';

import { Icon } from '@iconify/react';

import Button, { ButtonColor, ButtonSize } from './Button';

export interface IconButton {
  id?: string;
  text?: string;
  icon?: string;
  iconColor?: IconColor;
  onClick?: () => void;
}

interface IconButtonProps {
  iconSize?: number;
  buttonSize?: ButtonSize;
  buttonColor?: ButtonColor;
  circle?: boolean;
  onClick?: () => void;
}

export default function IconButton({
  text,
  icon,
  iconColor = 'textDefault',
  iconSize = 12,
  buttonSize = 'm',
  buttonColor = 'cancel',
  circle = false,
  onClick,
}: IconButtonProps & IconButton) {
  return (
    <Button
      size={buttonSize}
      color={buttonColor}
      onClick={onClick}
      circle={circle}
    >
      {icon && (
        <Icon
          icon={icon}
          fontSize={iconSize}
          className={iconColors[iconColor]}
        />
      )}
      {text && <span>{text}</span>}
    </Button>
  );
}
