import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface TarotImageResponse {
  cardUrl: string;
}

export function getTarotImageQuery(tarotId: number) {
  return useSuspenseQuery({
    queryKey: [`tarotImageQueryKey_${tarotId}}`],
    queryFn: async () =>
      (await axios.get<TarotImageResponse>(`${import.meta.env.VITE_WAS_URL}/tarot/card/${tarotId}`)).data,
  });
}
