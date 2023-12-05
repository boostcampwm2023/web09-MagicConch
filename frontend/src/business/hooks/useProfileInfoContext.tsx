import { useCallback, useContext } from 'react';

import { ProfileInfoContext } from '@stores/providers/ProfileInfoProvider';

export function useProfileInfoContext() {
  const context = useContext(ProfileInfoContext);

  if (!context) {
    throw new Error('현재 useProfileInfoContext가 ProfileInfoProvider아래에 있지 않음.');
  }

  const { profileInfos, setProfileInfos } = context;

  const setMyNickname = useCallback((nickname: string) => {
    setProfileInfos(prev => ({ ...prev, myNickname: nickname }));
  }, []);

  const setMyProfileImage = useCallback((arrayBuffer: ArrayBuffer, type: string) => {
    setProfileInfos(prev => ({ ...prev, myProfile: { arrayBuffer, type } }));
  }, []);

  const setRemoteNickname = useCallback((nickname: string) => {
    setProfileInfos(prev => ({ ...prev, remoteNickname: nickname }));
  }, []);

  const setRemoteProfileImage = useCallback((arrayBuffer: ArrayBuffer, type: string) => {
    setProfileInfos(prev => ({ ...prev, remoteProfile: { arrayBuffer, type } }));
  }, []);

  return {
    profileInfos,
    setMyNickname,
    setMyProfileImage,
    setRemoteNickname,
    setRemoteProfileImage,
  };
}
