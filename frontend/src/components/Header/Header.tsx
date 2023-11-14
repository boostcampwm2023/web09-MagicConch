import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";

interface HeaderProps {
  rightItems: React.ReactNode[];
}

export default function Header(props: HeaderProps) {
  return (
    <div className="flex justify-between items-center surface-content text-default pr-[28px] pl-[28px] pt-[12px] pb-[12px]">
      <HeaderLeft />
      <HeaderRight items={props.rightItems} />
    </div>
  );
};
