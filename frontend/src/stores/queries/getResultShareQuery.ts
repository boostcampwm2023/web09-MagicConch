import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export interface ResultShareResponse {
  card_url: string;
  content: string;
}

export function getResultShareQuery() {
  const { id } = useParams();

  return useSuspenseQuery({
    queryKey: ['resultShareQueryKey'],
    queryFn: async () => (await axios.get<ResultShareResponse>(`/result/${id}`)).data,
  });
}
