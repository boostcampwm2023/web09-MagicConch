import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export interface ResultShareResponse {
  cardUrl: string;
  message: string;
  cardUrl: string;
  message: string;
}

export function getResultShareQuery() {
  const { id } = useParams();

  return useSuspenseQuery({
    queryKey: [`resultShareQueryKey_${id}`],
    queryFn: async () =>
      (await axios.get<ResultShareResponse>(`${import.meta.env.VITE_BASE_URL}/tarot/result/${id}`)).data,
  });
}
