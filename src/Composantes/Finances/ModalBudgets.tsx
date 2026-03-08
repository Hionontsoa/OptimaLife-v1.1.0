import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, Edit2 } from 'lucide-react';

interface ModalBudgetsProps {
  afficherBudgets: boolean;
  setAfficherBudgets: (a: boolean) => void;
  categories: any[];
  statsCategories: any[];
  currency: string;
  setCategorieEnEdition: (c: any) => void;
  setNouveauBudget: (b: string) => void;
  categorieEnEdition: any;
  nouveauBudget: string;
  gererMiseAJourBudget: () => void;
}

/**
 * Modales pour la gestion des budgets par catégorie
 */
export const ModalBudgets = ({
  afficherBudgets,
  setAfficherBudgets,
  categories,
  statsCategories,
  currency,
  setCategorieEnEdition,
  setNouveauBudget,
  categorieEnEdition,
  nouveauBudget,
  gererMiseAJourBudget
}: ModalBudgetsProps) => {
  return (
    <>
      <AnimatePresence>
        {afficherBudgets && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Gestion des budgets</h3>
                <button onClick={() => setAfficherBudgets(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
                {categories.filter(c => c.type === 'depense').map(cat => {
                  const depenseActuelle = statsCategories.find(s => s.id === cat.id)?.value || 0;
                  const depasse = cat.montant_limite && depenseActuelle > cat.montant_limite;
                  
                  return (
                    <div 
                      key={cat.id} 
                      className={`p-4 rounded-2xl border transition-all ${depasse ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'} flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-3">
                        {depasse && <AlertCircle size={18} className="text-amber-500 shrink-0" />}
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white text-sm">{cat.nom}</p>
                          <p className={`text-[10px] font-medium ${depasse ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`}>
                            {depasse ? `${depenseActuelle.toFixed(2)} / ${cat.montant_limite?.toFixed(2)} ${currency}` : `Limite : ${cat.montant_limite?.toFixed(2) || '0,00'} ${currency}`}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setCategorieEnEdition(cat);
                          setNouveauBudget(cat.montant_limite?.toString() || '');
                        }}
                        className="p-2 text-brand-purple dark:text-brand-cyan hover:bg-brand-purple/10 dark:hover:bg-brand-cyan/10 rounded-xl transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {categorieEnEdition && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-[32px] p-8 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Budget {categorieEnEdition.nom}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Definissez une limite mensuelle pour cette categorie.</p>
              
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="0.00"
                    className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl font-bold text-xl focus:outline-none text-slate-900 dark:text-white"
                    value={nouveauBudget}
                    onChange={e => setNouveauBudget(e.target.value)}
                    autoFocus
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">{currency}</span>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setCategorieEnEdition(null)}
                    className="flex-1 py-3 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={gererMiseAJourBudget}
                    className="flex-1 bg-brand-purple dark:bg-brand-cyan text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-purple/20 dark:shadow-brand-cyan/20"
                  >
                    Valider
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
