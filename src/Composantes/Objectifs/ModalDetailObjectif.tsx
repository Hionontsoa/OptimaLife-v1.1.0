import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Trash2 } from 'lucide-react';

interface ModalDetailObjectifProps {
  objectifSelectionne: any;
  setObjectifSelectionne: (o: any) => void;
  setConfirmerSuppression: (c: { id: number } | null) => void;
  montantContribution: string;
  setMontantContribution: (m: string) => void;
  gererContribution: () => void;
  enCoursDeSoumission: boolean;
  currency: string;
}

/**
 * Modal affichant les détails d'un objectif et permettant d'ajouter des contributions
 */
export const ModalDetailObjectif = ({
  objectifSelectionne,
  setObjectifSelectionne,
  setConfirmerSuppression,
  montantContribution,
  setMontantContribution,
  gererContribution,
  enCoursDeSoumission,
  currency
}: ModalDetailObjectifProps) => {
  return (
    <AnimatePresence>
      {objectifSelectionne && (
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
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{objectifSelectionne.titre}</h3>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setConfirmerSuppression({ id: objectifSelectionne.id })}
                  className="text-rose-500 bg-rose-50 dark:bg-rose-900/20 p-2 rounded-xl"
                >
                  <Trash2 size={20} />
                </button>
                <button onClick={() => setObjectifSelectionne(null)} className="text-slate-400 dark:text-slate-500">Fermer</button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl text-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Progression actuelle</p>
                <h4 className="text-3xl font-bold text-brand-purple dark:text-brand-cyan">
                  {Math.round((objectifSelectionne.montant_actuel / objectifSelectionne.montant_cible) * 100)}%
                </h4>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">
                  {objectifSelectionne.montant_actuel.toLocaleString('fr-FR')} {currency} sur {objectifSelectionne.montant_cible.toLocaleString('fr-FR')} {currency}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">Ajouter une contribution</h4>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder={`Montant ${currency}`}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 p-4 rounded-xl font-medium focus:outline-none text-slate-900 dark:text-white"
                    value={montantContribution}
                    onChange={e => setMontantContribution(e.target.value)}
                  />
                  <button 
                    onClick={gererContribution}
                    disabled={enCoursDeSoumission}
                    className="bg-brand-purple dark:bg-brand-cyan text-white px-6 rounded-xl font-bold disabled:opacity-50"
                  >
                    {enCoursDeSoumission ? '...' : 'Ajouter'}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">Historique des contributions</h4>
                <div className="space-y-2">
                  {objectifSelectionne.contributions && objectifSelectionne.contributions.length > 0 ? (
                    objectifSelectionne.contributions.map((c: any) => (
                      <div key={c.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">+{c.montant} {currency}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">{format(new Date(c.date), 'dd MMM yyyy HH:mm', { locale: fr })}</p>
                        </div>
                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
                          <Plus size={14} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-400 text-xs py-4">Aucune contribution pour le moment</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
