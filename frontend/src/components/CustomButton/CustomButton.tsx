export type ButtonColor = 'active' | 'cancel' | 'disabled' | 'dark' | 'transparent';
export type ButtonSize = 's' | 'm' | 'l';

interface ButtonProps {
  color?: ButtonColor;
  size?: ButtonSize;
  circle?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  handleButtonClicked?: () => void;
}

const colorMap: Record<string, string> = {
  active: 'surface-point-alt text-white',
  cancel: 'surface-disabled text-white',
  disabled: 'surface-box text-weak',
  dark: 'surface-alt text-white',
  transparent: 'bg-transparent hover:bg-transparent hover:border-transparent',
};

const sizeMap: Record<string, string> = {
  s: 'h-40 display-bold14 leading-18 p-8 min-h-0',
  m: 'h-50 display-bold16 leading-20 p-16',
  l: 'h-60 display-bold16 leading-30 p-16',
};

function CustomButton({
  size,
  color = 'active',
  circle = false,
  disabled = false,
  children,
  handleButtonClicked,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`btn rounded-full border-transparent hover:scale-110 
      ${circle && 'btn-circle'}  ${colorMap[color]} ${size && !circle && sizeMap[size]}`}
      onClick={handleButtonClicked}
    >
      {children}
    </button>
  );
}

export default CustomButton;
