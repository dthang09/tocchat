import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { ConversationsPage } from './pages/ConversationsPage';
import { BotsPage } from './pages/BotsPage';
import { CallsPage } from './pages/CallsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <ConversationsPage />,
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
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);