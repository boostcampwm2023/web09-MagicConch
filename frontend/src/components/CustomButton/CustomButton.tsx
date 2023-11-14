interface ButtonProps {
  color?: 'active' | 'cancel' | 'disabled' | 'transparent';
  size?: 's' | 'm' | 'l';
  disabled?: boolean;
  children?: React.ReactNode;
  handleButtonClicked?: () => void;
}

const colorMap: Record<string, string> = {
  active: 'surface-point-alt',
  cancel: 'text-weak',
  disabled: 'surface-disabled',
  transparent: 'bg-transparent border-transparent',
};

const sizeMap: Record<string, string> = {
  s: 'h-6 display-bold16',
  m: 'h-14 display-bold16',
  l: 'h-16 display-bold16',
};

function CustomButton({ color = 'active', size = 'm', disabled = false, children, handleButtonClicked }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`btn rounded-full py-2 ${colorMap[color]} ${sizeMap[size]}`}
      onClick={handleButtonClicked}
    >
      {children}
    </button>
  );
}

export default CustomButton;
