import { RouterProvider } from 'react-router-dom';
import { rootRouter } from 'rootRouter';

import { BackgroundMusic, Cursor } from '@components/common';

export function App() {
  return (
    <>
      <Cursor />
      <RouterProvider router={rootRouter} />
      <BackgroundMusic />
    </>
  );
}
