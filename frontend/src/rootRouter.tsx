import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import AIChatPage from '@pages/AIChatPage';
import HomePage from '@pages/HomePage';
import HumanChatPage, { ChattingPage, SettingPage } from '@pages/HumanChatPage';
import ResultSharePage from '@pages/ResultSharePage';

import { MediaInfoProvider } from '@stores/providers/MediaInfoProvider';

export const rootRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route
        index
        path=""
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
    </Route>,
  ),
);
