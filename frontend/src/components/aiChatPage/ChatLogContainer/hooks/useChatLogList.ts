import { useEffect } from 'react';

import { AISocketManager } from '@business/services/SocketManager';

import { getChatLogListQuery } from '@stores/queries/getChatLogListQuery';
import { useAiChatLogId } from '@stores/zustandStores';

export function useChatLogList() {
  const { data, refetch } = getChatLogListQuery();
  const { removeId } = useAiChatLogId();

  useEffect(() => {
    const socketManager = AISocketManager.getInstance();
    socketManager.on('tarotCard', () => removeId());
    socketManager.on('chatEnd', () => refetch());
  }, []);

  return { list: data ?? [] };
}
