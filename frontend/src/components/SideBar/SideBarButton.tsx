import { useEffect } from 'react';

import { initSideBarStore, useSideBarStore } from '@stores/zustandStores/useSideBarStore';

export default function SideBarButton() {
  const { sideBarButtonState, toggleSideBarState } = useSideBarStore();

  const handleButtonClick = () => {
    if (!sideBarButtonState) return;
    toggleSideBarState();
  };

  useEffect(() => {
    initSideBarStore();
  }, []);

  return <button onClick={handleButtonClick}></button>;
}
