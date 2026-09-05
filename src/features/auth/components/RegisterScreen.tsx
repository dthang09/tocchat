import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../../../components/ui/Button';

export const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, isLoading, error: authError, clearError } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    const trimmedName = displayName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setFormError('Vui lòng nhập tên hiển thị của bạn.');
      return;
    }

    if (!trimmedEmail) {
      setFormError('Vui lòng nhập địa chỉ email.');
      return;
    }

    if (password.length < 6) {
      setFormError('Mật khẩu phải có độ dài ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      await signUp({
        email: trimmedEmail,
        password,
        displayName: trimmedName,
      });
      navigate('/', { replace: true });
    } catch {
      // Handled and formatted in authStore
    }
  };

  const displayedError = formError || authError;

  return (
    <div className="min-h-[100dvh] w-full bg-slate-900 md:bg-slate-950 flex items-center justify-center overflow-hidden">
      {/* Mobile-first Messenger container */}
      <div className="w-full max-w-[440px] h-[100dvh] md:h-[min(880px,96dvh)] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between overflow-y-auto no-scrollbar relative md:rounded-[40px] md:shadow-2xl md:ring-1 md:ring-slate-800/80 p-6 pt-safe pb-safe select-none">
        
        {/* Header / Logo section */}
        <div className="flex flex-col items-center text-center pt-6 pb-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/20 mb-3 animate-in zoom-in-95 duration-300">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Tạo tài khoản mới
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-[280px]">
            Đăng ký để trò chuyện với nhóm bạn thân của bạn
          </p>
        </div>

        {/* Form section */}
        <div className="w-full max-w-sm mx-auto my-auto py-2">
          {displayedError && (
            <div className="mb-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs font-medium animate-in fade-in-50 duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{displayedError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Display Name field */}
            <div className="space-y-1">
              <label
                htmlFor="register-name"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1"
              >
                Tên hiển thị
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="Ví dụ: Tuấn Nam"
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-1">
              <label
                htmlFor="register-email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1"
              >
                Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="name@example.com"
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <label
                htmlFor="register-password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1"
              >
                Mật khẩu (tối thiểu 6 ký tự)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-11 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password field */}
            <div className="space-y-1">
              <label
                htmlFor="register-confirm-password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1"
              >
                Xác nhận mật khẩu
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="register-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full h-12 rounded-2xl text-sm font-semibold shadow-md shadow-brand-500/20 active:scale-98 transition-transform"
              >
                {isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký tài khoản'}
              </Button>
            </div>
          </form>
        </div>

        {/* Footer link to Login */}
        <div className="pt-4 pb-2 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Đã có tài khoản?{' '}
            <Link
              to="/login"
              className="font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-block p-1"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
