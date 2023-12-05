import type { ButtonColor } from '@constants/colors';
import { ButtonColorMap } from '@constants/colors';
import type { ButtonSize } from '@constants/sizes';
import { buttonSizeMap } from '@constants/sizes';

interface ButtonProps {
  color?: ButtonColor;
  size?: ButtonSize;
  disabled?: boolean;
  children?: React.ReactNode;
  circle?: boolean;
  onClick?: () => void;
}

function Button({ size = 'm', color = 'active', disabled = false, children, onClick, circle = false }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`btn flex content-center rounded-full border-transparent hover:scale-110 hover:text-weak 
      ${buttonSizeMap[size]} ${ButtonColorMap[color]} ${!circle && 'pr-20 pl-20'}
      md:display-bold14 sm:display-bold12 w-fit h-fit min-w-fit min-h-fit`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
