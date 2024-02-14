import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface AuthorizedResponse {
  isAuthenticated: boolean;
}

export function getAuthorizedQuery() {
  return useQuery({
    queryKey: [`authorizedQueryKey`],
    queryFn: async () =>
      (
        await axios.get<AuthorizedResponse>(`${import.meta.env.VITE_WAS_URL}/oauth/authenticate`, {
          withCredentials: true,
        })
      ).data,
  });
}
