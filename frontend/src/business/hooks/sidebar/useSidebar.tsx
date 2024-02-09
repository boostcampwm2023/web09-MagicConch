import { type PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';

export function useSidebar() {
  const [sidebarOpened, setSidebarOpened] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const sideBarWidth = useMemo(() => sidebarRef.current?.clientWidth, [sidebarRef.current?.clientWidth]);

  const translateX = (width: number = 0) => {
    if (!mainRef.current || !sidebarRef.current) return;

    mainRef.current.style.transform = `translateX(-${width}px)`;
    sidebarRef.current.style.transform = `translateX(-${width}px)`;
  };

  const showSidebar = () => {
    requestAnimationFrame(() => {
      translateX(sideBarWidth);
      setSidebarOpened(true);
    });
  };

  const hideSidebar = () => {
    requestAnimationFrame(() => {
      translateX(0);
      setSidebarOpened(false);
    });
  };

  const toggleSidebar = () => {
    if (sidebarOpened) {
      hideSidebar();
    } else {
      showSidebar();
    }
  };

  const Sidebar = useMemo(
    () =>
      ({ children }: PropsWithChildren) =>
        (
          <aside
            ref={sidebarRef}
            className={`absolute left-[100%] w-screen lg:w-240  h-full pl-30 pr-30 surface-alt z-10`}
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
          <div
            ref={mainRef}
            className="w-h-full "
          >
            {children}
          </div>
        ),
    [],
  );

  useEffect(() => {
    if (!sidebarRef.current || !mainRef.current) return;

    mainRef.current.style.transition = `transform 0.5s ease-in-out`;
    sidebarRef.current.style.transition = `transform 0.5s ease-in-out`;
  }, []);

  return { toggleSidebar, sidebarOpened, Sidebar, SlideableContent };
}
