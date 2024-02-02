import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

export function getAuthorizedQuery() {
  return useSuspenseQuery({
    queryKey: [`authorizedQueryKey`],
    queryFn: async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_WAS_URL}/oauth/authenticated`);
        return response.status === 200;
      } catch {
        return false;
      }
    },
  });
}
