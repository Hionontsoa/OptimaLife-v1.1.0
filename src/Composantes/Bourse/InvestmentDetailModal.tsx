import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, Calendar, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { Card } from '../Communs/Card';

interface InvestmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  investissement: any;
  currency: string;
}

/**
 * Modal affichant les détails d'un actif financier spécifique
 */
export const InvestmentDetailModal = ({ isOpen, onClose, investissement, currency }: InvestmentDetailModalProps) => {
  if (!investissement) return null;

  const profit = investissement.valeur_actuelle - investissement.cout_acquisition;
  const pCent = (profit / investissement.cout_acquisition) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[60] flex items-end"
        >
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="bg-white dark:bg-slate-900 w-full rounded-t-[32px] p-8 pb-12 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-none">{investissement.nom}</h3>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Details de l'actif</p>
              </div>
              <button onClick={onClose} className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                <Calendar size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card className="p-5 bg-slate-50 dark:bg-slate-800/50 border-none">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Valeur Actuelle</p>
                <p className="text-xl font-black text-slate-800 dark:text-white">{investissement.valeur_actuelle.toLocaleString('fr-FR')} {currency}</p>
              </Card>
              <Card className="p-5 bg-slate-50 dark:bg-slate-800/50 border-none">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Performance</p>
                <p className={`text-xl font-black ${profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {profit >= 0 ? '+' : ''}{pCent.toFixed(2)}%
                </p>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                    <DollarSign size={20} />
                  </div>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Cout d'acquisition</span>
                </div>
                <span className="font-black text-slate-800 dark:text-white">{investissement.cout_acquisition.toLocaleString('fr-FR')} {currency}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 text-brand-cyan flex items-center justify-center">
                    <TrendingUp size={20} />
                  </div>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Plus-value latente</span>
                </div>
                <span className={`font-black ${profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {profit >= 0 ? '+' : ''}{profit.toLocaleString('fr-FR')} {currency}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-magenta/10 text-brand-magenta flex items-center justify-center">
                    <PieChartIcon size={20} />
                  </div>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Type d'actif</span>
                </div>
                <span className="font-black text-slate-800 dark:text-white uppercase text-[10px] tracking-widest">{investissement.type}</span>
              </div>
            </div>

            <button className="w-full bg-brand-purple dark:bg-brand-cyan text-white dark:text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest mt-8 shadow-lg shadow-brand-purple/20 dark:shadow-brand-cyan/20 active:scale-95 transition-transform">
              Mettre a jour la valeur
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
