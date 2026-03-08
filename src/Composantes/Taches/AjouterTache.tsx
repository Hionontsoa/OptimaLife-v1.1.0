import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Bell, Calendar } from 'lucide-react';

interface AjouterTacheProps {
  nouvelleTache: string;
  setNouvelleTache: (t: string) => void;
  ajouterTache: () => void;
  afficherRappel: boolean;
  setAfficherRappel: (a: boolean) => void;
  dateLimite: string;
  setDateLimite: (d: string) => void;
  heureRappel: string;
  setHeureRappel: (h: string) => void;
  priorite: 'faible' | 'moyenne' | 'haute';
  setPriorite: (p: 'faible' | 'moyenne' | 'haute') => void;
}

/**
 * Formulaire pour ajouter une nouvelle tâche avec options de rappel et priorité
 */
export const AjouterTache = ({
  nouvelleTache,
  setNouvelleTache,
  ajouterTache,
  afficherRappel,
  setAfficherRappel,
  dateLimite,
  setDateLimite,
  heureRappel,
  setHeureRappel,
  priorite,
  setPriorite
}: AjouterTacheProps) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Nouvelle tache..."
          className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple text-slate-900 dark:text-white"
          value={nouvelleTache}
          onChange={e => setNouvelleTache(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && ajouterTache()}
        />
        <button 
          onClick={() => setAfficherRappel(!afficherRappel)}
          className={`p-4 rounded-2xl border transition-colors ${afficherRappel ? 'bg-brand-purple/10 border-brand-purple/20 text-brand-purple' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'}`}
        >
          <Bell size={24} />
        </button>
        <button 
          onClick={ajouterTache}
          disabled={!nouvelleTache.trim()}
          className="bg-brand-purple dark:bg-brand-cyan text-white p-4 rounded-2xl shadow-lg shadow-brand-purple/20 dark:shadow-brand-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={24} />
        </button>
      </div>
      
      <AnimatePresence>
        {afficherRappel && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-2"
          >
            <div className="flex gap-2">
              <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex items-center gap-2">
                <Calendar size={16} className="text-slate-400 dark:text-slate-500" />
                <input 
                  type="date" 
                  className="flex-1 bg-transparent focus:outline-none text-sm font-medium text-slate-600 dark:text-slate-300"
                  value={dateLimite}
                  onChange={e => setDateLimite(e.target.value)}
                />
              </div>
              <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex items-center gap-2">
                <Bell size={16} className="text-slate-400 dark:text-slate-500" />
                <input 
                  type="datetime-local" 
                  className="flex-1 bg-transparent focus:outline-none text-sm font-medium text-slate-600 dark:text-slate-300"
                  value={heureRappel}
                  onChange={e => setHeureRappel(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              {(['faible', 'moyenne', 'haute'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPriorite(p)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-colors ${
                    priorite === p 
                      ? p === 'haute' ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                      : p === 'moyenne' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400'
                      : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {p === 'faible' ? 'Basse' : p === 'moyenne' ? 'Moyenne' : 'Haute'}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
