import { HeaderRight } from '.';

import { LogoButton } from '@components/common/Buttons';

interface HeaderProps {
  rightItems?: React.ReactNode[];
}

export function Header({ rightItems }: HeaderProps) {
  return (
    <div className="fixed top-0 w-full h-48 flex justify-between items-center surface-content text-default px-8 py-5 z-50">
      <LogoButton />
      <HeaderRight items={rightItems} />
    </div>
  );
}
