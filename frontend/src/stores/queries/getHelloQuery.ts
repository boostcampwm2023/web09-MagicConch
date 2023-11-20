import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface HelloResponse {
  hello: string;
}

async function getHello() {
  const response = await axios.get<HelloResponse>('/hello');
  return response.data;
}

export function getHelloQuery() {
  return useQuery({ queryKey: ['hello'], queryFn: getHello });
}
