import HeaderLeft from './HeaderLeft';
import HeaderRight from './HeaderRight';

interface HeaderProps {
  rightItems: React.ReactNode[];
}

export default function Header({ rightItems }: HeaderProps) {
  return (
    <div className="flex justify-between items-center surface-content text-default pr-28 pl-28 pt-12 pb-12">
      <HeaderLeft />
      <HeaderRight items={rightItems} />
    </div>
  );
}
