import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../Communs/Card';

interface FormulaireTransactionProps {
  afficherAjout: boolean;
  setAfficherAjout: (a: boolean) => void;
  nouvelleTransac: any;
  setNouvelleTransac: (t: any) => void;
  categories: any[];
  currency: string;
  gererAjout: () => void;
}

/**
 * Formulaire modal pour ajouter une nouvelle transaction (revenu ou dépense)
 */
export const FormulaireTransaction = ({ 
  afficherAjout, 
  setAfficherAjout, 
  nouvelleTransac, 
  setNouvelleTransac, 
  categories, 
  currency, 
  gererAjout 
}: FormulaireTransactionProps) => {
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
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Ajouter une transaction</h3>
              <button onClick={() => setAfficherAjout(false)} className="text-slate-400 dark:text-slate-500">Fermer</button>
            </div>

            <div className="space-y-4">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button 
                  onClick={() => setNouvelleTransac({ ...nouvelleTransac, type: 'depense', categorie_id: '' })}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${nouvelleTransac.type === 'depense' ? 'bg-white dark:bg-slate-700 shadow-sm text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  Depense
                </button>
                <button 
                  onClick={() => setNouvelleTransac({ ...nouvelleTransac, type: 'revenu', categorie_id: '' })}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${nouvelleTransac.type === 'revenu' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  Revenu
                </button>
              </div>

              <input 
                type="number" 
                placeholder={`0.00 ${currency}`}
                className="w-full text-4xl font-bold text-center py-4 focus:outline-none bg-transparent text-slate-900 dark:text-white"
                value={nouvelleTransac.montant}
                onChange={e => setNouvelleTransac({ ...nouvelleTransac, montant: e.target.value })}
              />

              <select 
                className={`w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-xl font-medium focus:outline-none text-slate-900 dark:text-white border-2 transition-all ${!nouvelleTransac.categorie_id && nouvelleTransac.montant ? 'border-amber-400/50' : 'border-transparent'}`}
                value={nouvelleTransac.categorie_id}
                onChange={e => setNouvelleTransac({ ...nouvelleTransac, categorie_id: e.target.value })}
              >
                <option value="">Selectionner une categorie</option>
                {categories.filter(c => c.type === nouvelleTransac.type).length === 0 ? (
                  <option disabled>Aucune categorie disponible</option>
                ) : (
                  categories.filter(c => c.type === nouvelleTransac.type).map(c => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))
                )}
              </select>
              {!nouvelleTransac.categorie_id && nouvelleTransac.montant && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase ml-1 animate-pulse">
                  Veuillez choisir une categorie pour enregistrer
                </p>
              )}

              <input 
                type="text" 
                placeholder="Description (optionnel)"
                className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-xl font-medium focus:outline-none text-slate-900 dark:text-white"
                value={nouvelleTransac.description}
                onChange={e => setNouvelleTransac({ ...nouvelleTransac, description: e.target.value })}
              />

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Date de la transaction</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-xl font-medium focus:outline-none text-slate-900 dark:text-white"
                  value={nouvelleTransac.date}
                  onChange={e => setNouvelleTransac({ ...nouvelleTransac, date: e.target.value })}
                />
              </div>

              <button 
                onClick={gererAjout}
                disabled={!nouvelleTransac.montant || !nouvelleTransac.categorie_id || isNaN(parseFloat(nouvelleTransac.montant)) || parseFloat(nouvelleTransac.montant) <= 0}
                className={`w-full py-4 rounded-2xl font-bold mt-4 shadow-lg transition-all ${(!nouvelleTransac.montant || !nouvelleTransac.categorie_id || isNaN(parseFloat(nouvelleTransac.montant)) || parseFloat(nouvelleTransac.montant) <= 0) ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed' : 'bg-brand-purple dark:bg-brand-cyan text-white shadow-brand-purple/20 dark:shadow-brand-cyan/20'}`}
              >
                Enregistrer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
