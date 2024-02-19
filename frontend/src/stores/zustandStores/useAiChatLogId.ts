import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AiChatLogIdState {
  id: string | null;
}

interface AiChatLogIdActions {
  setId: (id: string) => void;
  removeId: () => void;
}

const initialState: AiChatLogIdState = {
  id: null,
};

export const useAiChatLogId = create<AiChatLogIdState & AiChatLogIdActions>()(
  devtools(set => ({
    ...initialState,
    setId: (id: string) => set(() => ({ id })),
    removeId: () => set(() => ({ id: null })),
  })),
);
