import React from 'react';
import { Card } from '../Communs/Card';

/**
 * Composant affichant un aperçu fictif du marché boursier en direct
 */
export const GraphiqueMarche = () => {
  const stocks = [
    { name: 'AAPL', price: '182.52', change: '+1.25%', up: true },
    { name: 'BTC', price: '64,230', change: '-0.45%', up: false },
    { name: 'TSLA', price: '202.64', change: '+2.10%', up: true },
    { name: 'NVDA', price: '785.38', change: '+4.52%', up: true },
  ];

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Marche en direct</h3>
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Ouvert
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stocks.map(stock => (
          <div key={stock.name} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-black text-slate-800 dark:text-white">{stock.name}</span>
              <span className={`text-[9px] font-bold ${stock.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stock.change}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{stock.price} $</p>
          </div>
        ))}
      </div>
    </div>
  );
};
