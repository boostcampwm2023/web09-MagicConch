import { useEffect } from 'react';

import { initSideBarStore, useSideBarStore } from '@stores/zustandStores/useSideBarStore';

export function useSideBarButton() {
  const { sideBarState, sideBarButtonState, toggleSideBarState } = useSideBarStore();

  const buttonDisabled = !sideBarButtonState;

  const handleClick = () => {
    toggleSideBarState();
  };

  useEffect(() => {
    initSideBarStore();
  }, []);

  useEffect(() => {
    if (sideBarButtonState || !sideBarState) {
      return;
    }
    toggleSideBarState();
  }, [sideBarButtonState]);

  return { handleClick, buttonDisabled };
}
