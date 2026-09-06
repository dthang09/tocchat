import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../../../components/ui/Spinner';

import { PresenceProvider } from '../../presence';

export const ProtectedRoute: React.FC = () => {
  const { user, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="min-h-[100dvh] w-full bg-slate-900 md:bg-slate-950 flex items-center justify-center">
        <div className="w-full max-w-[440px] h-[100dvh] md:h-[min(880px,96dvh)] bg-white dark:bg-slate-950 flex flex-col items-center justify-center gap-3 md:rounded-[40px]">
          <Spinner size="lg" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Đang khởi động phiên...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <PresenceProvider user={user}>
      <Outlet />
    </PresenceProvider>
  );
};
