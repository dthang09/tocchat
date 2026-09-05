import React, { useState } from 'react';
import { cn } from '../../utils/cn';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export interface AvatarProps {
  src?: string | null;
  name?: string | null;
  alt?: string;
  size?: AvatarSize;
  className?: string;
  isOnline?: boolean;
  showOnlineDot?: boolean;
  statusText?: string | null;
  onClick?: () => void;
}

const sizeClasses: Record<AvatarSize, { container: string; text: string; dot: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-[10px]', dot: 'w-2 h-2 ring-1' },
  sm: { container: 'w-8 h-8', text: 'text-xs', dot: 'w-2.5 h-2.5 ring-1.5' },
  md: { container: 'w-10 h-10', text: 'text-sm', dot: 'w-3 h-3 ring-2' },
  lg: { container: 'w-12 h-12', text: 'text-base', dot: 'w-3.5 h-3.5 ring-2' },
  xl: { container: 'w-14 h-14', text: 'text-lg', dot: 'w-4 h-4 ring-2' },
  '2xl': { container: 'w-[72px] h-[72px]', text: 'text-2xl', dot: 'w-4.5 h-4.5 ring-2.5' },
  '3xl': { container: 'w-24 h-24', text: 'text-3xl', dot: 'w-5 h-5 ring-3' },
};

const gradientPresets = [
  'from-brand-500 to-sky-400',
  'from-indigo-500 to-purple-400',
  'from-fuchsia-500 to-pink-400',
  'from-rose-500 to-amber-400',
  'from-emerald-500 to-teal-400',
  'from-sky-500 to-indigo-400',
  'from-amber-500 to-orange-400',
];

function getGradient(name?: string | null): string {
  if (!name) return gradientPresets[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradientPresets.length;
  return gradientPresets[index];
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  alt,
  size = 'md',
  className,
  isOnline,
  showOnlineDot = false,
  statusText,
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);
  const sizeConfig = sizeClasses[size];

  const displayName = name?.trim() || 'User';
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';
  const gradientClass = getGradient(displayName);

  const hasValidImage = Boolean(src) && !imgError;

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative inline-flex shrink-0 select-none rounded-full',
        sizeConfig.container,
        onClick && 'cursor-pointer active:scale-95 transition-transform',
        className
      )}
      title={statusText || displayName}
    >
      <div
        className={cn(
          'w-full h-full rounded-full overflow-hidden flex items-center justify-center font-bold text-white shadow-xs',
          !hasValidImage && `bg-gradient-to-tr ${gradientClass}`
        )}
      >
        {hasValidImage ? (
          <img
            src={src!}
            alt={alt || displayName}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className={cn('leading-none tracking-tight', sizeConfig.text)}>
            {initial}
          </span>
        )}
      </div>

      {showOnlineDot && isOnline !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-white dark:ring-slate-950',
            sizeConfig.dot,
            isOnline ? 'bg-emerald-500' : 'bg-slate-400'
          )}
          aria-label={isOnline ? 'Đang online' : 'Ngoại tuyến'}
        />
      )}
    </div>
  );
};
