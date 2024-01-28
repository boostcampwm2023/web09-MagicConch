import { useSideBarButton } from '@business/hooks/useSideBar';

export default function SideBarButton() {
  const { handleClick, buttonDisabled } = useSideBarButton();

  return (
    <button
      onClick={handleClick}
      disabled={buttonDisabled}
    ></button>
  );
}
