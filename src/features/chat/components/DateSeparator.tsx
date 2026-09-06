import React from 'react';

interface DateSeparatorProps {
  dateString: string;
}

const formatDateSeparator = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) return 'Hôm nay';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return 'Hôm qua';

  const isSameYear = date.getFullYear() === now.getFullYear();

  if (isSameYear) {
    return `Ngày ${date.getDate()} tháng ${date.getMonth() + 1}`;
  }

  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export const DateSeparator: React.FC<DateSeparatorProps> = React.memo(({ dateString }) => {
  const formatted = formatDateSeparator(dateString);

  return (
    <div className="flex items-center justify-center my-3 select-none">
      <span className="px-3 py-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-xs rounded-full shadow-2xs border border-slate-200/50 dark:border-slate-700/50">
        {formatted}
      </span>
    </div>
  );
});

DateSeparator.displayName = 'DateSeparator';
