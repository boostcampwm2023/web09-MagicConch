import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export type ChatLogResponse = {
  isHost: boolean;
  message: string;
}[];

export function getChatLogQuery(id: string) {
  return useQuery({
    queryKey: [`chatLogQueryKey_${id}`],
    queryFn: async () =>
      (await axios.get<ChatLogResponse>(`${import.meta.env.VITE_WAS_URL}/chat/ai/${id}`, { withCredentials: true }))
        .data,
  });
}
