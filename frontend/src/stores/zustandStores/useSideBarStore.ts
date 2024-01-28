import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SideBarState {
  sideBarState: boolean;
  sideBarButtonState: boolean;
}

interface SideBarActions {
  toggleSideBarState: () => void;
  toggleSideBarButtonState: () => void;
  showSideBar: () => void;
  hideSideBar: () => void;
  enableSideBar: () => void;
  disableSideBarButton: () => void;
}

export const initialState: SideBarState = {
  sideBarState: false,
  sideBarButtonState: true,
};

export const useSideBarStore = create<SideBarState & SideBarActions>()(
  devtools(set => ({
    ...initialState,
    toggleSideBarState: () => set(state => ({ sideBarState: !state.sideBarState })),
    toggleSideBarButtonState: () => set(state => ({ sideBarButtonState: !state.sideBarButtonState })),
    showSideBar: () => set({ sideBarState: true }),
    hideSideBar: () => set({ sideBarState: false }),
    enableSideBar: () => set({ sideBarButtonState: true }),
    disableSideBarButton: () => set({ sideBarButtonState: false }),
  })),
);

export function initSideBarStore() {
  useSideBarStore.setState(initialState);
}
