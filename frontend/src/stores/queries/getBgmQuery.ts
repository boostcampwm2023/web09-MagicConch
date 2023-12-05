import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

const GET_BGM_API =
  'https://www.viodio.io/_api/v1/musics/627c8e78715664b72b9bee90/audios/dcbfe1206d7b4410a7e71963bc9e2e4d?auto_play=true';

export interface BgmResponse {
  url: string;
}

export function getBgmQuery() {
  return useSuspenseQuery({
    queryKey: [`bgmQueryKey`],
    queryFn: async () => (await axios.get<BgmResponse>(GET_BGM_API)).data,
  });
}
