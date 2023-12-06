import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import { OutletContext } from './HumanChatPage';

export function useChattingPageChangeVideoTrackJoined() {
  const {
    chatPageState: { joined },
    changeMyVideoTrack,
  }: OutletContext = useOutletContext();

  useEffect(() => {
    if (joined) {
      changeMyVideoTrack();
      return;
    }
  }, []);
}
