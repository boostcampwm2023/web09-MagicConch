import { type PropsWithChildren, useMemo, useRef, useState } from 'react';

export function useSidebar() {
  const [sidebarOpened, setSidebarOpened] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const translateX = (width: number = 0) => {
    if (!mainRef.current || !sidebarRef.current) return;

    mainRef.current.style.transform = `translateX(-${width}px)`;
    sidebarRef.current.style.transform = `translateX(-${width}px)`;
  };

  const showSidebar = () => {
    requestAnimationFrame(() => {
      setSidebarOpened(true);
      translateX(sidebarRef.current?.clientWidth);
    });
  };

  const hideSidebar = () => {
    requestAnimationFrame(() => {
      setSidebarOpened(false);
      translateX(0);
    });
  };

  const toggleSidebar = () => {
    sidebarOpened ? hideSidebar() : showSidebar();
  };

  const Sidebar = useMemo(
    () =>
      ({ children }: PropsWithChildren) =>
        (
          <aside
            ref={sidebarRef}
            className={`fixed top-0 left-[100%] w-screen lg:w-240 h-full surface-alt z-10 transition-transform ease-in-out duration-500 `}
          >
            {children}
          </aside>
        ),
    [],
  );

  const SlideableContent = useMemo(
    () =>
      ({ children }: PropsWithChildren) =>
        (
          <section
            ref={mainRef}
            className={`w-h-full transition-transform ease-in-out duration-500`}
          >
            {children}
          </section>
        ),
    [],
  );

  return { toggleSidebar, sidebarOpened, Sidebar, SlideableContent };
}
