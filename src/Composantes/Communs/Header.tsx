import React from 'react';

export const Header = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <header className="px-6 pt-8 pb-4">
    <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">{title}</h1>
    {subtitle && <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{subtitle}</p>}
  </header>
);
