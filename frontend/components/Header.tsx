import React from 'react';
import { LogoIcon } from './icons';
import ThemeToggle from './ThemeToggle';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/70 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/70">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <LogoIcon className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-200">
              Utilities Bill Visualizer
            </span>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
