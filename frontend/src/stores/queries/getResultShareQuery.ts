import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

interface ResultShareResponse {
  card_url: string;
  content: string;
}

export function getResultShareQuery(id: number | string) {
  return useSuspenseQuery({
    queryKey: ['resultShareQueryKey'],
    queryFn: async () => (await axios.get<ResultShareResponse>(`/result/${id}`)).data,
  });
}
