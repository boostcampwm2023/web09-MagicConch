import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export type ChatLogListResponse = {
  id: string;
  title: string;
}[];

export function getChatLogListQuery() {
  return useQuery({
    queryKey: [`chatLogListQueryKey`],
    queryFn: async () =>
      (await axios.get<ChatLogListResponse>(`${import.meta.env.VITE_WAS_URL}/chat/ai`, { withCredentials: true })).data,
  });
}
