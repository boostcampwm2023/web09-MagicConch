import { HttpResponse, http } from 'msw';

export const handlers = [
  http.get('/hello', () => {
    return HttpResponse.json({ hello: 'from server' });
  }),
];
