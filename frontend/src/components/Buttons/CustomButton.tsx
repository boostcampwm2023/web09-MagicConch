import { detect } from 'detect-browser';

export type ButtonColor = 'active' | 'cancel' | 'disabled' | 'dark' | 'transparent';
export type ButtonSize = 's' | 'm' | 'l';

interface ButtonProps {
  color?: ButtonColor;
  size?: ButtonSize;
  circle?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

const colorMap: Record<string, string> = {
  active: 'surface-point-alt text-white',
  cancel: 'surface-disabled text-white',
  disabled: 'surface-box text-weak',
  dark: 'surface-alt text-white',
  transparent: 'bg-transparent hover:bg-transparent hover:border-transparent',
};

const browser = detect();
const __MAC__ = browser?.os?.includes('Mac');

const sizeMap: Record<string, string> = {
  s: `h-40 display-bold14 ${__MAC__ ? 'leading-18' : ''} p-8 min-h-0`,
  m: `h-50 display-bold16 ${__MAC__ ? 'leading-20' : ''} p-16`,
  l: `h-60 display-bold16 ${__MAC__ ? 'leading-30' : ''} p-16`,
};

function CustomButton({ size, color = 'active', circle = false, disabled = false, children, onClick }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`btn rounded-full border-transparent hover:scale-110 
      ${circle && 'btn-circle'}  ${colorMap[color]} ${size && !circle && sizeMap[size]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default CustomButton;
