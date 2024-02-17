import { Link } from 'react-router-dom';

interface LogoButtonProps {}

export function LogoButton({}: LogoButtonProps) {
  return (
    <Link
      to="/"
      className="flex display-bold16"
    >
      <img
        className="w-33 h-33 mr-8"
        src="/logo.png"
        alt="마법의 소라고둥 로고 이미지"
      />
      <span className="leading-35 text-strong">마법의 소라고둥</span>
    </Link>
  );
}
