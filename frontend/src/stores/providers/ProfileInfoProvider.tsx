import { Dispatch, PropsWithChildren, SetStateAction, createContext, useMemo, useState } from 'react';

export interface ProfileInfo {
  arrayBuffer: ArrayBuffer;
  type: string;
}
export interface ProfileInfoState {
  myNickname?: string;
  myProfile?: ProfileInfo;
  remoteNickname?: string;
  remoteProfile?: ProfileInfo;
}

interface ProfileInfoProviderProps {
  profileInfos: ProfileInfoState;
  setProfileInfos: Dispatch<SetStateAction<ProfileInfoState>>;
}
export const ProfileInfoContext = createContext<ProfileInfoProviderProps | undefined>(undefined);

export function ProfileInfoProvider({ children }: PropsWithChildren) {
  const [profileInfos, setProfileInfos] = useState<ProfileInfoState>({});

  const value = useMemo(() => ({ profileInfos, setProfileInfos }), [profileInfos, setProfileInfos]);

  return <ProfileInfoContext.Provider value={value}>{children}</ProfileInfoContext.Provider>;
}
