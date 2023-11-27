import { Route, Routes } from 'react-router-dom';

import AIChatPage from './pages/AIChatPage';
import HomePage from './pages/HomePage';
import HumanChatPage from './pages/HumanChatPage';
import ReaderListPage from './pages/ReaderListPage';
import ResultSharePage from './pages/ResultSharePage';

import BackgroundMusic from './components/BackgroundMusic';
import Cursor from '@components/Cursor';

import { DataChannelProvider } from '@business/hooks/DataChannelProvider';

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
            <DataChannelProvider>
              <HumanChatPage />
            </DataChannelProvider>
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
