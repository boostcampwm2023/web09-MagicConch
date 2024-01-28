import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SideBarState {
  sideBarState: boolean;
  sideBarButtonState: boolean;
}

interface SideBarActions {
  toggleSideBarState: () => void;
  toggleSideBarButtonState: () => void;
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
  })),
);

export function initSideBarStore() {
  useSideBarStore.setState(initialState);
}
