import App from './App';
import './tailwind.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { OverlayProvider } from './business/hooks/useOverlay/OverlayProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <OverlayProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </OverlayProvider>
  </React.StrictMode>,
);
