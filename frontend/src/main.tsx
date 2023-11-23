import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { OverlayProvider } from './business/hooks/useOverlay/OverlayProvider';

import App from './App';
import './tailwind.css';

if (import.meta.env.MODE === 'development') {
  const { worker } = await import('./mocks/browser');

  // onUnhandledRequest를 byPass로 주면
  // 미들웨어에서 처리되지 않는 요청은 그대로 브라우저로 전달됨.
  worker.start({ onUnhandledRequest: 'bypass' });
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <OverlayProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </OverlayProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);
