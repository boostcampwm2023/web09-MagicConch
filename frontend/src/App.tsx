import { Route, Routes } from 'react-router-dom';

import AIChatPage from './pages/AIChatPage';
import HomePage from './pages/HomePage';
import HumanChatPage from './pages/HumanChatPage';
import ReaderListPage from './pages/ReaderListPage';
import ResultSharePage from './pages/ResultSharePage';

import BackgroundMusic from './components/BackgroundMusic';
import Cursor from '@components/Cursor';

import { MediaInfoProvider } from '@business/providers/MediaInfoProvider';

function App() {
  return (
    <>
      <Cursor />
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/chat/ai/:id?"
          element={<AIChatPage />}
        />
        <Route
          path="/chat/human/:roomName"
          element={
            <MediaInfoProvider>
              <HumanChatPage />
            </MediaInfoProvider>
          }
        />
        <Route
          path="/readers"
          element={<ReaderListPage />}
        />
        <Route
          path="/result/:id"
          element={<ResultSharePage />}
        />
      </Routes>
      <BackgroundMusic />
    </>
  );
}

export default App;
