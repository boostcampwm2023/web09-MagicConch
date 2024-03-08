import { LogoButton } from '@components/common/Buttons';

import Toast from './Toast';

interface HeaderProps {
  rightItems?: React.ReactNode[];
}

export function Header({ rightItems }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full h-48 flex justify-between items-center surface-content text-default px-8 py-5 z-20">
      <LogoButton />
      <div className="flex-with-center gap-16">
        {rightItems?.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
      <Toast />
    </header>
  );
}
