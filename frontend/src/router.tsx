import { SocketErrorBoundary, UnknownErrorBoundary } from 'errorBoundaries';
import APIErrorBoundary from 'errorBoundaries/APIErrorBoundary';
import { Outlet, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import {
  AIChatPage,
  ChattingPage,
  HomePage,
  HumanChatPage,
  OAuthRedirectHandlePage,
  ResultSharePage,
  SettingPage,
} from './pages';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <UnknownErrorBoundary>
          <SocketErrorBoundary>
            <APIErrorBoundary>
              <Outlet />
            </APIErrorBoundary>
          </SocketErrorBoundary>
        </UnknownErrorBoundary>
      }
    >
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
        element={<HumanChatPage />}
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
      <Route
        path="/oauth2redirect/kakao"
        element={<OAuthRedirectHandlePage />}
      />
    </Route>,
  ),
);
