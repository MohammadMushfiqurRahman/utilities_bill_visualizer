import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, trend }) => {
  const trendColor =
    trend?.direction === 'up'
      ? 'text-red-500'
      : trend?.direction === 'down'
      ? 'text-green-500'
      : 'text-slate-500';

  const trendIcon =
    trend?.direction === 'up' ? '⬆️' : trend?.direction === 'down' ? '⬇️' : '';

  return (
    <div className="rounded-xl bg-white p-4 shadow-md sm:p-6 dark:bg-slate-800">
      <div className="flex items-center">
        <div className="mr-4">
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{value}</p>
        </div>
      </div>
      {trend && (
        <div className="mt-2 flex items-center">
          <span className={`text-sm font-semibold ${trendColor}`}>
            {trendIcon} {trend.value}
          </span>
          <span className="ml-1 text-sm text-slate-500 dark:text-slate-400">
            vs. last month
          </span>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;