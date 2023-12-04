import { RouterProvider } from 'react-router-dom';
import { rootRouter } from 'rootRouter';

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
