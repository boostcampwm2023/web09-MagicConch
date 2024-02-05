import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SideBarState {
  first: boolean;
  sideBarState: boolean;
  sideBarButtonState: boolean;
}

interface SideBarActions {
  toggleSideBarState: () => void;
  toggleSideBarButtonState: () => void;
  showSideBar: () => void;
  hideSideBar: () => void;
  enableSideBarButton: () => void;
  disableSideBarButton: () => void;
  visited: () => void;
}

export const initialState: SideBarState = {
  first: true,
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
    enableSideBarButton: () => set({ sideBarButtonState: true }),
    disableSideBarButton: () => set({ sideBarButtonState: false }),
    visited: () => set({ first: false }),
  })),
);

export function initSideBarStore() {
  useSideBarStore.setState(initialState);
}
