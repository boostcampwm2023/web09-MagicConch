import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ProfileInfo {
  arrayBuffer: ArrayBuffer;
  type: string;
}

interface ProfileInfoState {
  myNickname?: string;
  myProfile?: ProfileInfo | undefined;
  remoteNickname?: string;
  remoteProfile?: ProfileInfo;
}

interface ProfileInfoActions {
  setMyNickname: (value: string) => void;
  setMyProfile: (profileInfo: ProfileInfo) => void;
  setRemoteNickname: (value: string) => void;
  setRemoteProfile: (profileInfo: ProfileInfo) => void;
}

export const useProfileInfo = create<ProfileInfoState & ProfileInfoActions>()(
  devtools(set => ({
    myNickname: '',
    myProfile: undefined,
    remoteNickname: '',
    remoteProfile: undefined,
    setMyNickname: (myNickname: string) => set(() => ({ myNickname })),
    setMyProfile: (myProfile: ProfileInfo) => set(() => ({ myProfile })),
    setRemoteNickname: (remoteNickname: string) => set(() => ({ remoteNickname })),
    setRemoteProfile: (remoteProfile: ProfileInfo) => set(() => ({ remoteProfile })),
  })),
);
