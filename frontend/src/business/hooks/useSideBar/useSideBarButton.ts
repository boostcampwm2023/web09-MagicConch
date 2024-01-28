import { useEffect } from 'react';

import { initSideBarStore, useSideBarStore } from '@stores/zustandStores/useSideBarStore';

export function useSideBarButton() {
  const { sideBarButtonState, toggleSideBarState, hideSideBar } = useSideBarStore();

  const buttonDisabled = !sideBarButtonState;

  const handleClick = () => {
    toggleSideBarState();
  };

  useEffect(() => {
    initSideBarStore();
  }, []);

  useEffect(() => {
    if (sideBarButtonState) {
      return;
    }
    hideSideBar();
  }, [sideBarButtonState]);

  return { handleClick, buttonDisabled };
}
