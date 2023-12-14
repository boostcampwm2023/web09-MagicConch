import { useEffect, useState } from 'react';

interface useHumanChatPageSideBarParams {
  onDisableSideBar: () => void;
}
export function useHumanChatPageSideBar({ onDisableSideBar }: useHumanChatPageSideBarParams) {
  const [sideBarDisabled, setSideBarDisabled] = useState<boolean>(false);

  const disableSideBar = () => {
    onDisableSideBar();

    setSideBarDisabled(true);
  };

  const enableSideBar = () => {
    setSideBarDisabled(false);
  };

  useEffect(() => {
    disableSideBar();
  }, []);

  return { disableSideBar, enableSideBar, sideBarDisabled };
}
