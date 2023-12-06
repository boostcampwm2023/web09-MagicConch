import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface HostState {
  host: boolean;
}

interface HostActions {
  setHost: (value: boolean) => void;
}

const initialState: HostState = {
  host: false,
};

export const useHost = create<HostState & HostActions>()(
  devtools(set => ({
    ...initialState,
    setHost: (value: boolean) => set(() => ({ host: value })),
  })),
);
