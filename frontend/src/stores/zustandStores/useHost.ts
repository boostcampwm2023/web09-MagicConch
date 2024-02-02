import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface HostState {
  host: boolean;
  joined: boolean;
}

interface HostActions {
  setHost: (value: boolean) => void;
  setJoined: (value: boolean) => void;
  reset: () => void;
}

const initialState: HostState = {
  host: false,
  joined: false,
};

export const useHumanChatPage = create<HostState & HostActions>()(
  devtools(set => ({
    ...initialState,
    setHost: (value: boolean) => set(() => ({ host: value })),
    setJoined: (value: boolean) => set(() => ({ joined: value })),
    reset: () => set(initialState),
  })),
);
