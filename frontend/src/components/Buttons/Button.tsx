import type { ButtonColor } from '@constants/colors';
import { ButtonColorMap } from '@constants/colors';
import type { ButtonSize } from '@constants/sizes';
import { circleButtonSizeMap, defaultButtonSizeMap } from '@constants/sizes';

interface ButtonProps {
  color?: ButtonColor;
  size?: ButtonSize;
  circle?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

function Button({ size = 'm', color = 'active', circle = false, disabled = false, children, onClick }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`btn rounded-full border-transparent hover:scale-110 hover:text-weak 
      ${circle && circleButtonSizeMap[size]} ${!circle && defaultButtonSizeMap[size]} ${ButtonColorMap[color]}
      md:display-bold14 sm:display-bold12`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
