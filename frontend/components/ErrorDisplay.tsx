import React from 'react';
import { WarningIcon } from './icons';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mt-4 flex items-start space-x-3 rounded-lg border border-red-300 bg-red-100 p-4 dark:border-red-700 dark:bg-red-900/30">
      <WarningIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500 dark:text-red-400" />
      <div>
        <h4 className="font-semibold text-red-800 dark:text-red-200">Processing Error</h4>
        <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
      </div>
    </div>
  );
};
