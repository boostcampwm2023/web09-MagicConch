import { mockResults } from './mockResults';
import { HttpResponse, http } from 'msw';

export const handlers = [
  http.get('/hello', () => {
    return HttpResponse.json({ hello: 'from server' });
  }),

  http.get('/result/:id', ({ params }) => {
    const { id } = params;
    const { card_url, content } = mockResults[+id];

    return HttpResponse.json({ card_url, content });
  }),
];
