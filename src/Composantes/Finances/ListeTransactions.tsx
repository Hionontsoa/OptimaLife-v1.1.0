import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { Card } from '../Communs/Card';
import { TransactionIcon } from '../Communs/TransactionIcon';
import { Transaction } from '../../types';

interface ListeTransactionsProps {
  transactions: Transaction[];
  recherche: string;
  setRecherche: (r: string) => void;
  idCategorieFiltre: number | null;
  currency: string;
  supprimerTransaction: (id: number) => void;
}

/**
 * Composant affichant la liste des transactions groupées par date
 */
export const ListeTransactions = ({ 
  transactions, 
  recherche, 
  setRecherche, 
  idCategorieFiltre, 
  currency, 
  supprimerTransaction 
}: ListeTransactionsProps) => {
  const transactionsFiltrees = transactions
    .filter(t => !idCategorieFiltre || t.categorie_id === idCategorieFiltre)
    .filter(t => 
      (t.description || '').toLowerCase().includes(recherche.toLowerCase()) || 
      (t.categories?.nom || '').toLowerCase().includes(recherche.toLowerCase())
    );

  const transactionsGroupees = transactionsFiltrees.reduce((acc: any, t) => {
    const dateStr = format(new Date(t.date), 'yyyy-MM-dd');
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(t);
    return acc;
  }, {});

  const datesTriees = Object.keys(transactionsGroupees).sort((a, b) => b.localeCompare(a));

  const getLabelDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Aujourd'hui";
    if (isYesterday(date)) return "Hier";
    return format(date, 'dd MMMM yyyy', { locale: fr });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Rechercher une transaction..."
          className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 pl-12 pr-4 py-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all text-slate-900 dark:text-white"
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={20} />
        </div>
      </div>

      <div className="space-y-6">
        {datesTriees.map(date => (
          <div key={date} className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">
              {getLabelDate(date)}
            </h4>
            <div className="space-y-3">
              {transactionsGroupees[date].map((t: Transaction) => (
                <TransactionCard 
                  key={t.id} 
                  t={t} 
                  currency={currency} 
                  supprimerTransaction={supprimerTransaction} 
                />
              ))}
            </div>
          </div>
        ))}
        {datesTriees.length === 0 && (
          <p className="text-center text-slate-400 text-xs py-8">Aucun resultat pour votre recherche</p>
        )}
      </div>
    </div>
  );
};

const TransactionCard = ({ t, currency, supprimerTransaction }: { t: Transaction, currency: string, supprimerTransaction: (id: number) => void }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative group"
    >
      <Card className="p-3 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <TransactionIcon iconName={t.categories?.icon || t.categories?.icone || 'Wallet'} color={t.categories?.couleur || '#6366f1'} />
          <div>
            <p className="font-bold text-slate-800 dark:text-white text-sm leading-tight">{t.description || t.categories?.nom}</p>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-medium mt-0.5">{t.categories?.nom}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className={`font-black text-sm ${t.type === 'revenu' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'}`}>
            {t.type === 'revenu' ? '+' : '-'}{t.montant.toLocaleString('fr-FR')} {currency}
          </p>
          <button 
            onClick={() => setShowConfirm(!showConfirm)}
            className="p-2 text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 transition-colors"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </Card>

      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-0 top-0 bottom-0 z-20 flex items-center pr-2"
          >
            <div className="bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 rounded-xl flex overflow-hidden">
              <button className="p-3 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => supprimerTransaction(t.id)}
                className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
