import { LogoButton } from '@components/Buttons';

import HeaderRight from './HeaderRight';

interface HeaderProps {
  rightItems?: React.ReactNode[];
}

export default function Header({ rightItems }: HeaderProps) {
  return (
    <div className="fixed top-0 w-full h-48 flex justify-between items-center surface-content text-default px-8 py-5 z-50">
      <LogoButton />
      <HeaderRight items={rightItems} />
    </div>
  );
}
