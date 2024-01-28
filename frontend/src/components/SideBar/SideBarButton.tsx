import { useEffect } from 'react';

import { initSideBarStore, useSideBarStore } from '@stores/zustandStores/useSideBarStore';

export default function SideBarButton() {
  const { sideBarState, sideBarButtonState, toggleSideBarState } = useSideBarStore();

  const handleClick = () => {
    if (!sideBarButtonState) return;
    toggleSideBarState();
  };

  useEffect(() => {
    initSideBarStore();
  }, []);

  useEffect(() => {
    if (sideBarButtonState || !sideBarState) return;
    toggleSideBarState();
  }, [sideBarButtonState]);

  return <button onClick={handleClick}></button>;
}
