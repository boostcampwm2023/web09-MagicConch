import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface TarotImageResponse {
  cardUrl: string;
}

export function getTarotImage(tarotId: number) {
  return useSuspenseQuery({
    queryKey: ['tarotImageQueryKey'],
    queryFn: async () =>
      (await axios.get<TarotImageResponse>(`${import.meta.env.VITE_BASE_URL}/tarot/card/${tarotId}`)).data,
  });
}
