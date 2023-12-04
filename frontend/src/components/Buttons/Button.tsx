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

const defaultSizeMap: Record<string, string> = {
  s: `h-40 min-h-0 display-bold14 ${__MAC__ ? 'leading-18' : ''} p-8 `,
  m: `h-50 display-bold16 ${__MAC__ ? 'leading-20' : ''} p-16`,
  l: `h-60 display-bold16 ${__MAC__ ? 'leading-30' : ''} p-16`,
};

const circleSizeMap: Record<string, string> = {
  s: 'h-40 w-40 p-0',
  m: 'h-50 w-50 p-0',
  l: 'h-60 w-60 p-0',
};

function Button({ size = 'm', color = 'active', circle = false, disabled = false, children, onClick }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`btn rounded-full border-transparent hover:scale-110 hover:text-weak 
      ${circle && circleSizeMap[size]} ${!circle && defaultSizeMap[size]} ${colorMap[color]}
      md:display-bold14 sm:display-bold12`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
