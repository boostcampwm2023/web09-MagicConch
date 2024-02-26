import { RouterProvider } from 'react-router-dom';
import { router } from 'router';

import { BackgroundMusic, Cursor } from '@components/common';

export function App() {
  return (
    <>
      <Cursor />
      <RouterProvider router={router} />
      <BackgroundMusic />
    </>
  );
}
