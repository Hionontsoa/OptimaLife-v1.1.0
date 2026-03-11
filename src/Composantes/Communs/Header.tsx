import React from 'react';

export const Header = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <header className="pt-4 pb-4 md:pt-6 md:pb-8">
    <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white font-display tracking-tight">{title}</h1>
    {subtitle && <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base mt-1 md:mt-2 font-medium">{subtitle}</p>}
  </header>
);
