import HeaderLeft from './HeaderLeft';
import HeaderRight from './HeaderRight';

interface HeaderProps {
  rightItems: React.ReactNode[];
}

export default function Header({ rightItems }: HeaderProps) {
  return (
    <div className="fixed top-0 w-full flex justify-between items-center surface-content text-default px-8 py-5">
      <HeaderLeft />
      <HeaderRight items={rightItems} />
    </div>
  );
}
