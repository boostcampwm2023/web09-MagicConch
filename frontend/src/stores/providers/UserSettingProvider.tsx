import { Dispatch, PropsWithChildren, SetStateAction, createContext, useMemo, useState } from 'react';

export interface MediaInfoState {}

export const MediaInfoContext = createContext<
  { mediaInfos: MediaInfoState; setMediaInfos: Dispatch<SetStateAction<MediaInfoState>> } | undefined
>(undefined);

export function MediaInfoProvider({ children }: PropsWithChildren) {
  const [mediaInfos, setMediaInfos] = useState<MediaInfoState>({
    myMicOn: true,
    myVideoOn: true,
    remoteMicOn: false,
    remoteVideoOn: false,
    selectedCameraID: '',
    selectedAudioID: '',
  });

  const value = useMemo(() => ({ mediaInfos, setMediaInfos }), [mediaInfos, setMediaInfos]);

  return <MediaInfoContext.Provider value={value}>{children}</MediaInfoContext.Provider>;
}
