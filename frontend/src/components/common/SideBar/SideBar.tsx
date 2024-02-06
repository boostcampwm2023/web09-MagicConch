import { type ForwardedRef, type PropsWithChildren, forwardRef } from 'react';

function SideBarComponent({ children }: PropsWithChildren, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <aside
      ref={ref}
      className={`absolute left-[100%] w-screen lg:w-240  h-full pl-30 pr-30 surface-alt z-30`}
    >
      {children}
    </aside>
  );
}

export const SideBar = forwardRef(SideBarComponent);
