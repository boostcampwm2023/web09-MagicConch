import { Route, Routes } from 'react-router-dom';

import AIChatPage from './pages/AIChatPage';
import HomePage from './pages/HomePage';
import HumanChatPage, { ChattingPage, SettingPage } from './pages/HumanChatPage';
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
          path="/chat/human/:roomName?"
          element={
            <MediaInfoProvider>
              <HumanChatPage />
            </MediaInfoProvider>
          }
        >
          <Route
            path="/chat/human/:roomName"
            element={<ChattingPage />}
          />
          <Route
            path="/chat/human/:roomName/setting"
            element={<SettingPage />}
          />
        </Route>
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
