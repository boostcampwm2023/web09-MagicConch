import { Dispatch, PropsWithChildren, SetStateAction, createContext, useMemo, useState } from 'react';

export interface MediaInfoState {
  myMicOn: boolean;
  myVideoOn: boolean;
  remoteMicOn: boolean;
  remoteVideoOn: boolean;
  selectedCameraID: string;
  selectedAudioID: string;
}
interface MediaInfoProviderProps {
  mediaInfos: MediaInfoState;
  setMediaInfos: Dispatch<SetStateAction<MediaInfoState>>;
}

export const MediaInfoContext = createContext<MediaInfoProviderProps | undefined>(undefined);

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
