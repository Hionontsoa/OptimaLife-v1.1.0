import React from 'react';
import { TrendingUp, TrendingDown, Trash2, Search } from 'lucide-react';
import { Card } from '../Communs/Card';
import { Investissement } from '../../types';

interface ListeActionsProps {
  investissements: Investissement[];
  currency: string;
  setActifSelectionne: (inv: Investissement) => void;
  setConfirmerSuppression: (conf: { id: number } | null) => void;
  requeteRecherche: string;
  setRequeteRecherche: (r: string) => void;
}

const TYPE_COLORS: Record<string, string> = {
  stock: '#7000FF',
  crypto: '#00D1FF',
  real_estate: '#FF007A',
  cash: '#10B981',
  other: '#64748b'
};

const getIcon = (type: string) => {
  switch (type) {
    case 'stock': return <TrendingUp size={20} />;
    case 'crypto': return <TrendingUp size={20} className="rotate-45" />;
    case 'real_estate': return <TrendingUp size={20} className="-rotate-45" />;
    case 'cash': return <TrendingUp size={20} />;
    default: return <TrendingUp size={20} />;
  }
};

/**
 * Liste des actifs financiers (actions, crypto, immo) avec indicateurs de profit
 */
export const ListeActions = ({ 
  investissements, 
  currency, 
  setActifSelectionne, 
  setConfirmerSuppression,
  requeteRecherche,
  setRequeteRecherche
}: ListeActionsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {investissements.map(inv => {
        const profit = inv.valeur_actuelle - inv.cout_acquisition;
        const pCent = (profit / inv.cout_acquisition) * 100;
        return (
          <Card 
            key={inv.id} 
            className="p-0 overflow-hidden group relative border-slate-100 dark:border-slate-800 hover:border-brand-purple/30 dark:hover:border-brand-cyan/30 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            onClick={() => setActifSelectionne(inv)}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: `${TYPE_COLORS[inv.type]}15`, color: TYPE_COLORS[inv.type] }}>
                    {getIcon(inv.type)}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 dark:text-white text-sm leading-tight">{inv.nom}</p>
                    <p className="text-slate-400 dark:text-slate-500 text-[9px] uppercase tracking-widest font-bold mt-0.5">
                      {inv.type === 'stock' ? 'Action' : inv.type === 'crypto' ? 'Crypto' : inv.type === 'real_estate' ? 'Immobilier' : inv.type === 'cash' ? 'Cash' : 'Autre'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-800 dark:text-white text-lg tracking-tight">{inv.valeur_actuelle.toLocaleString('fr-FR')} {currency}</p>
                  <div className={`text-[10px] font-black flex items-center justify-end gap-0.5 ${profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {profit >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {profit >= 0 ? '+' : ''}{pCent.toFixed(2)}%
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Prix d'achat</span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{inv.cout_acquisition.toLocaleString('fr-FR')} {currency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Profit/Perte</span>
                  <span className={`text-xs font-black ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {profit >= 0 ? '+' : ''}{profit.toLocaleString('fr-FR')} {currency}
                  </span>
                </div>
                <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${profit >= 0 ? 'bg-emerald-400' : 'bg-rose-400'}`} 
                    style={{ width: `${Math.min(Math.abs(pCent), 100)}%` }} 
                  />
                </div>
              </div>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setConfirmerSuppression({ id: inv.id });
              }}
              className="absolute right-3 top-3 w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
            >
              <Trash2 size={14} />
            </button>
          </Card>
        );
      })}
      {investissements.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-200 dark:text-slate-700 shadow-sm mb-6">
            <Search size={40} />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-black text-lg">Aucun resultat trouve</p>
          <p className="text-slate-400 text-xs mt-2 max-w-[240px] text-center">Essayez de modifier vos filtres ou votre recherche.</p>
          {requeteRecherche && (
            <button 
              onClick={() => setRequeteRecherche('')}
              className="mt-6 text-brand-purple font-black text-[10px] uppercase tracking-widest"
            >
              Effacer la recherche
            </button>
          )}
        </div>
      )}
    </div>
  );
};
