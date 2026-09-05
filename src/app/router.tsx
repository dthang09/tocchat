import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { ConversationsPage } from './pages/ConversationsPage';
import { BotsPage } from './pages/BotsPage';
import { CallsPage } from './pages/CallsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginScreen, RegisterScreen, ProtectedRoute, PublicOnlyRoute } from '../features/auth';
import { ProfileScreen, EditProfileScreen } from '../features/profiles';
import { ConversationScreen } from '../features/conversations';

export const router = createBrowserRouter([
  // Public auth routes (redirects authenticated users away from /login and /register)
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: '/login',
        element: <LoginScreen />,
      },
      {
        path: '/register',
        element: <RegisterScreen />,
      },
    ],
  },

  // Protected application routes (requires authentication)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppShell />,
        children: [
          {
            index: true,
            element: <ConversationsPage />,
          },
          {
            path: 'conversations/:conversationId',
            element: <ConversationScreen />,
          },
          {
            path: 'bots',
            element: <BotsPage />,
          },
          {
            path: 'calls',
            element: <CallsPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
          {
            path: 'profile',
            element: <ProfileScreen />,
          },
          {
            path: 'profile/edit',
            element: <EditProfileScreen />,
          },
        ],
      },
    ],
  },

  // Fallback 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);