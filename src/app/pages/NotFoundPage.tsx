import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-black text-slate-300 dark:text-slate-800 mb-2">404</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Trang bạn yêu cầu không tồn tại.</p>
      <Link to="/">
        <Button variant="primary" size="sm">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Về trang chủ
        </Button>
      </Link>
    </div>
  );
};