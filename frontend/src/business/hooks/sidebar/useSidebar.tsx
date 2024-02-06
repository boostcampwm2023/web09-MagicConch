import { useEffect, useMemo, useRef, useState } from 'react';

export function useSidebar() {
  const [sidebarOpened, setSidebarOpened] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const sideBarWidth = useMemo(() => sidebarRef.current?.clientWidth, [sidebarRef.current?.clientWidth]);

  const changeTransform = (width: number = 0) => {
    if (!mainRef.current || !sidebarRef.current) return;

    mainRef.current.style.transform = `translateX(-${width}px)`;
    sidebarRef.current.style.transform = `translateX(-${width}px)`;
  };

  const showSidebar = () => {
    requestAnimationFrame(() => {
      changeTransform(sideBarWidth);
      setSidebarOpened(true);
    });
  };

  const hideSidebar = () => {
    requestAnimationFrame(() => {
      changeTransform(0);
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

  useEffect(() => {
    if (!sidebarRef.current || !mainRef.current) return;

    mainRef.current.style.transition = `transform 0.5s ease-in-out`;
    sidebarRef.current.style.transition = `transform 0.5s ease-in-out`;
  }, []);

  return { mainRef, sidebarRef, toggleSidebar, sidebarOpened };
}
