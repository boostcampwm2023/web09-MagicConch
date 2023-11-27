import { Dispatch, PropsWithChildren, SetStateAction, createContext, useMemo, useState } from 'react';

export interface DataChannelState {
  myMicOn: boolean;
  myVideoOn: boolean;
  remoteMicOn: boolean;
  remoteVideoOn: boolean;
}

export const DataChannelContext = createContext<
  { mediaInfos: DataChannelState; setMediaInfos: Dispatch<SetStateAction<DataChannelState>> } | undefined
>(undefined);

export function DataChannelProvider({ children }: PropsWithChildren) {
  const [mediaInfos, setMediaInfos] = useState<DataChannelState>({
    myMicOn: true,
    myVideoOn: true,
    remoteMicOn: false,
    remoteVideoOn: false,
  });

  const value = useMemo(() => ({ mediaInfos, setMediaInfos }), [mediaInfos, setMediaInfos]);

  return <DataChannelContext.Provider value={value}>{children}</DataChannelContext.Provider>;
}
