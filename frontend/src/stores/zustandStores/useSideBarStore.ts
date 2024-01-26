import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SideBarState {
  sideBarState: boolean;
  sideBarButtonState: boolean;
}

interface SideBarActions {
  showSideBar: () => void;
  hideSideBar: () => void;
  activeSideBarButton: () => void;
  deactiveSideBarButton: () => void;
}

export const initialState: SideBarState = {
  sideBarState: false,
  sideBarButtonState: true,
};

export const useSideBarStore = create<SideBarState & SideBarActions>()(
  devtools(set => ({
    ...initialState,
    showSideBar: () => set(() => ({ sideBarState: true })),
    hideSideBar: () => set(() => ({ sideBarState: false })),
    activeSideBarButton: () => set(() => ({ sideBarButtonState: true })),
    deactiveSideBarButton: () => set(() => ({ sideBarButtonState: false })),
  })),
);

export function initSideBarStore() {
  useSideBarStore.setState(initialState);
}
