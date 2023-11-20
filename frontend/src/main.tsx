import App from './App';
import './tailwind.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { OverlayProvider } from './business/hooks/useOverlay/OverlayProvider';

if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser');
  worker.start();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <OverlayProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </OverlayProvider>,
);
