import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export type ChatLogResponse = {
  isHost: boolean;
  message: string;
}[];

export function getChatLogQuery(id: string | null) {
  return useQuery({
    queryKey: [`chatLogQueryKey_${id}`],
    queryFn: async () => {
      if (!id) return null;
      return (
        await axios.get<ChatLogResponse>(`${import.meta.env.VITE_WAS_URL}/chat/ai/${id}`, { withCredentials: true })
      ).data;
    },
  });
}
