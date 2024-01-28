import { useEffect, useRef } from 'react';

interface SideBarProps {
  children: React.ReactNode;
}

export default function SideBar({ children }: SideBarProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.marginRight = '-100%';
  });

  return (
    <aside
      ref={ref}
      className="w-fit h-full"
    >
      {children}
    </aside>
  );
}
