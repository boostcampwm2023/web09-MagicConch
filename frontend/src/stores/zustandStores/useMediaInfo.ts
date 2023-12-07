import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface MediaInfoState {
  myMicOn: boolean;
  myVideoOn: boolean;
  remoteMicOn: boolean;
  remoteVideoOn: boolean;
  selectedCameraID: string;
  selectedAudioID: string;
}

interface MediaInfoActions {
  toggleMyVideo: () => void;
  toggleMyMic: () => void;
  toggleRemoteVideo: () => void;
  toggleRemoteMic: () => void;
  setMyVideoOn: (value: boolean) => void;
  setMyMicOn: (value: boolean) => void;
  setRemoteVideoOn: (value: boolean) => void;
  setRemoteMicOn: (value: boolean) => void;
  setSelectedCameraID: (value: string) => void;
  setSelectedAudioID: (value: string) => void;
}

const initialState: MediaInfoState = {
  myMicOn: false,
  myVideoOn: false,
  remoteMicOn: false,
  remoteVideoOn: false,
  selectedCameraID: '',
  selectedAudioID: '',
};

export const useMediaInfo = create<MediaInfoState & MediaInfoActions>()(
  devtools(set => ({
    ...initialState,
    toggleMyVideo: () => set(state => ({ myVideoOn: !state.myVideoOn })),
    toggleMyMic: () => set(state => ({ myMicOn: !state.myMicOn })),
    toggleRemoteVideo: () => set(state => ({ remoteVideoOn: !state.remoteVideoOn })),
    toggleRemoteMic: () => set(state => ({ remoteMicOn: !state.remoteMicOn })),
    setMyVideoOn: (value: boolean) => set(() => ({ myVideoOn: value })),
    setMyMicOn: (value: boolean) => set(() => ({ myMicOn: value })),
    setRemoteVideoOn: (value: boolean) => set(() => ({ remoteVideoOn: value })),
    setRemoteMicOn: (value: boolean) => set(() => ({ remoteMicOn: value })),
    setSelectedCameraID: (value: string) => set(() => ({ selectedCameraID: value })),
    setSelectedAudioID: (value: string) => set(() => ({ selectedAudioID: value })),
  })),
);
