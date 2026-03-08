import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AddInvestmentModalProps {
  afficherAjout: boolean;
  setAfficherAjout: (a: boolean) => void;
  nouvelInv: any;
  setNouvelInv: (i: any) => void;
  gererAjout: () => void;
  currency: string;
}

/**
 * Modal pour ajouter un nouvel actif au portefeuille
 */
export const AddInvestmentModal = ({
  afficherAjout,
  setAfficherAjout,
  nouvelInv,
  setNouvelInv,
  gererAjout,
  currency
}: AddInvestmentModalProps) => {
  return (
    <AnimatePresence>
      {afficherAjout && (
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
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Nouvel Actif</h3>
              <button onClick={() => setAfficherAjout(false)} className="text-slate-400 dark:text-slate-500">Fermer</button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Nom de l'actif</label>
                <input 
                  type="text" 
                  placeholder="Ex: Apple (AAPL) ou Bitcoin"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple text-slate-900 dark:text-white"
                  value={nouvelInv.nom}
                  onChange={e => setNouvelInv({ ...nouvelInv, nom: e.target.value })}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Cout d'achat</label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple text-slate-900 dark:text-white"
                    value={nouvelInv.cout_acquisition}
                    onChange={e => setNouvelInv({ ...nouvelInv, cout_acquisition: e.target.value })}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Valeur actuelle</label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple text-slate-900 dark:text-white"
                    value={nouvelInv.valeur_actuelle}
                    onChange={e => setNouvelInv({ ...nouvelInv, valeur_actuelle: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Type d'actif</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple text-slate-900 dark:text-white"
                  value={nouvelInv.type}
                  onChange={e => setNouvelInv({ ...nouvelInv, type: e.target.value })}
                >
                  <option value="stock">Action</option>
                  <option value="crypto">Crypto</option>
                  <option value="real_estate">Immobilier</option>
                  <option value="cash">Cash / Livret</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <button 
                onClick={gererAjout}
                disabled={!nouvelInv.nom.trim() || !nouvelInv.cout_acquisition || !nouvelInv.valeur_actuelle || parseFloat(nouvelInv.cout_acquisition) < 0 || parseFloat(nouvelInv.valeur_actuelle) < 0}
                className="w-full bg-brand-purple dark:bg-brand-cyan text-white dark:text-slate-900 py-4 rounded-2xl font-bold mt-4 shadow-lg shadow-brand-purple/20 dark:shadow-brand-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ajouter au Portefeuille
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
