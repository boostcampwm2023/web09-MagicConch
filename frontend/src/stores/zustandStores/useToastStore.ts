import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ToastStoreState {
  message: string | null;
}

interface ToastStoreActions {
  setMessage: (message: string) => void;
  removeToast: () => void;
}

const initialState: ToastStoreState = {
  message: null,
};

export const useToastStore = create<ToastStoreState & ToastStoreActions>()(
  devtools(set => ({
    ...initialState,
    setMessage: (message: string) => set(() => ({ message })),
    removeToast: () => set(() => ({ message: null })),
  })),
);
