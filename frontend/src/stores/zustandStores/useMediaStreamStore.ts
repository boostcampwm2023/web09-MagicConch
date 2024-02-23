import { create } from 'zustand';

interface MediaStreamActions {
  setLocalStream: (stream: MediaStream) => void;
  setRemoteStream: (stream: MediaStream) => void;
}

const initialState = {
  localStream: new MediaStream(),
  remoteStream: new MediaStream(),
};
export const useMediaStreamStore = create<typeof initialState & MediaStreamActions>()(set => ({
  ...initialState,
  setLocalStream: stream => set(state => ({ ...state, localStream: stream })),
  setRemoteStream: stream => set(state => ({ ...state, remoteStream: stream })),
}));
