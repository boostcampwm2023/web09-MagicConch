import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface AuthorizedResponse {
  isAuthenticated: boolean;
}

export function getAuthorizedQuery() {
  return useSuspenseQuery({
    queryKey: [`authorizedQueryKey`],
    queryFn: async () =>
      (await axios.get<AuthorizedResponse>(`${import.meta.env.VITE_WAS_URL}/oauth/authenticated`)).data,
  });
}
