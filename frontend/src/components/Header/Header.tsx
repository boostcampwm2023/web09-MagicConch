import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";

interface HeaderProps {
  rightItems: React.ReactNode[];
}

export default function Header(props: HeaderProps) {
  return (
    <div className="flex">
      <HeaderLeft />
      <HeaderRight items={props.rightItems} />
    </div>
  );
};
