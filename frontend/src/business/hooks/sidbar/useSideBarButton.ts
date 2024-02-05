import { useEffect } from 'react';

import { initSideBarStore, useSideBarStore } from '@stores/zustandStores';

export function useSideBarButton() {
  const { sideBarState, sideBarButtonState, toggleSideBarState, hideSideBar, visited } = useSideBarStore();

  const buttonDisabled = !sideBarButtonState;

  const handleClick = () => {
    toggleSideBarState();
    visited();
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

  return { sideBarState, handleClick, buttonDisabled };
}
