import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target } from 'lucide-react';
import { ICONS } from '../../types';

interface AjouterObjectifProps {
  afficherModalCreation: boolean;
  setAfficherModalCreation: (a: boolean) => void;
  nouvelObjectif: any;
  setNouvelObjectif: (o: any) => void;
  gererCreationObjectif: () => void;
  currency: string;
}

/**
 * Modal pour créer un nouvel objectif financier
 */
export const AjouterObjectif = ({
  afficherModalCreation,
  setAfficherModalCreation,
  nouvelObjectif,
  setNouvelObjectif,
  gererCreationObjectif,
  currency
}: AjouterObjectifProps) => {
  const iconesObjectif = ['Target', 'Wallet', 'Home', 'Car', 'GraduationCap', 'HeartPulse', 'ShoppingBag', 'Gamepad', 'Briefcase', 'TrendingUp'];

  return (
    <AnimatePresence>
      {afficherModalCreation && (
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
            className="bg-white dark:bg-slate-900 w-full rounded-t-[32px] p-8 pb-12"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Nouvel objectif</h3>
              <button onClick={() => setAfficherModalCreation(false)} className="text-slate-400 dark:text-slate-500">Fermer</button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Titre</label>
                <input 
                  type="text" 
                  placeholder="Ex: Voyage au Japon"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple text-slate-900 dark:text-white"
                  value={nouvelObjectif.titre}
                  onChange={e => setNouvelObjectif({ ...nouvelObjectif, titre: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Montant cible ({currency})</label>
                <input 
                  type="number" 
                  placeholder="2000"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple text-slate-900 dark:text-white"
                  value={nouvelObjectif.montant_cible}
                  onChange={e => setNouvelObjectif({ ...nouvelObjectif, montant_cible: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Echeance</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple text-slate-900 dark:text-white"
                  value={nouvelObjectif.date_limite}
                  onChange={e => setNouvelObjectif({ ...nouvelObjectif, date_limite: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Icone</label>
                <div className="flex flex-wrap gap-2">
                  {iconesObjectif.map(iconName => {
                    const Icon = (ICONS as any)[iconName];
                    return (
                      <button
                        key={iconName}
                        onClick={() => setNouvelObjectif({ ...nouvelObjectif, icone: iconName })}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          nouvelObjectif.icone === iconName ? 'bg-brand-purple dark:bg-brand-cyan text-white dark:text-slate-900 shadow-lg shadow-brand-purple/20 dark:shadow-brand-cyan/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700'
                        }`}
                      >
                        <Icon size={18} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <button 
                onClick={gererCreationObjectif}
                disabled={!nouvelObjectif.titre.trim() || !nouvelObjectif.montant_cible || parseFloat(nouvelObjectif.montant_cible) <= 0}
                className="w-full bg-brand-purple dark:bg-brand-cyan text-white dark:text-slate-900 py-4 rounded-2xl font-bold mt-4 shadow-lg shadow-brand-purple/20 dark:shadow-brand-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Creer l'objectif
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
