import { iconColors } from '@constants/colors';

import { Icon } from '@iconify/react';

import CustomButton, { ButtonColor, ButtonSize } from './CustomButton';

export interface IconButton {
  id?: string;
  text?: string;
  icon?: string;
  iconColor?: keyof typeof iconColors;
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
    <CustomButton
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
    </CustomButton>
  );
}
