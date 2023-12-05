import { Dispatch, PropsWithChildren, SetStateAction, createContext, useMemo, useState } from 'react';

export interface ProfileInfo {
  arrayBuffer: ArrayBuffer;
  type: string;
}
export interface ProfileInfoState {
  myNickname: string;
  myProfile?: ProfileInfo;
  remoteNickname: string;
  remoteProfile?: ProfileInfo;
}

export const ProfileInfoContext = createContext<
  { profileInfos: ProfileInfoState; setProfileInfos: Dispatch<SetStateAction<ProfileInfoState>> } | undefined
>(undefined);

export function ProfileInfoProvider({ children }: PropsWithChildren) {
  const [profileInfos, setProfileInfos] = useState<ProfileInfoState>({
    myNickname: '나',
    remoteNickname: '상대',
  });

  const value = useMemo(() => ({ profileInfos, setProfileInfos }), [profileInfos, setProfileInfos]);

  return <ProfileInfoContext.Provider value={value}>{children}</ProfileInfoContext.Provider>;
}
