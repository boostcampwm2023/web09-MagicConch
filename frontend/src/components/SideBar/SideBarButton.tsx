import { useEffect } from 'react';

import { initSideBarStore, useSideBarStore } from '@stores/zustandStores/useSideBarStore';

export default function SideBarButton() {
  const { toggleSideBarState } = useSideBarStore();

  const handleButtonClick = () => {
    toggleSideBarState();
  };

  useEffect(() => {
    initSideBarStore();
  }, []);

  return <button onClick={handleButtonClick}></button>;
}
