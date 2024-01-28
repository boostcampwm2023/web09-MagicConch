import { useEffect } from 'react';

import { initSideBarStore } from '@stores/zustandStores/useSideBarStore';

export default function SideBarButton() {
  useEffect(() => {
    initSideBarStore();
  }, []);

  return <button></button>;
}
