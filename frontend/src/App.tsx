import { rootRouter } from 'RootRouter';
import { RouterProvider } from 'react-router-dom';

import BackgroundMusic from './components/BackgroundMusic';
import Cursor from '@components/Cursor';

function App() {
  return (
    <>
      <Cursor />
      <RouterProvider router={rootRouter} />
      <BackgroundMusic />
    </>
  );
}

export default App;
