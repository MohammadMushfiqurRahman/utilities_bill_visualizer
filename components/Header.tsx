
import React from 'react';
import { LogoIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <LogoIcon className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">
              Utility AI
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
