import { LogoButton } from '@components/common/Buttons';

import Toast from './Toast';

interface HeaderProps {
  rightItems?: React.ReactNode[];
}

export function Header({ rightItems }: HeaderProps) {
  return (
    <header className="sticky w-full h-48 flex justify-between items-center surface-content text-default px-8 py-5 z-50">
      <LogoButton />
      {rightItems?.map((item, index) => (
        <div
          className="flex gap-16"
          key={index}
        >
          {item}
        </div>
      ))}
      <Toast />
    </header>
  );
}
