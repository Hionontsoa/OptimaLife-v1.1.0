import React from 'react';
import { format } from 'date-fns';
import { Calendar, Bell, CheckSquare, Trash2 } from 'lucide-react';
import { Card } from '../Communs/Card';
import { Tache } from '../../types';

interface ListeTachesProps {
  taches: Tache[];
  basculerTache: (id: number, terminee: boolean) => void;
  setConfirmerSuppression: (conf: { id: number } | null) => void;
}

/**
 * Liste des tâches avec options de complétion et suppression
 */
export const ListeTaches = ({ taches, basculerTache, setConfirmerSuppression }: ListeTachesProps) => {
  return (
    <div className="space-y-3">
      {taches.map(tache => (
        <Card key={tache.id} className="p-4 flex items-center gap-4 group relative overflow-hidden">
          <button 
            onClick={() => basculerTache(tache.id, tache.terminee)}
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
              tache.terminee ? 'bg-brand-purple border-brand-purple' : 'border-slate-300 dark:border-slate-700'
            }`}
          >
            {tache.terminee && <CheckSquare size={14} className="text-white" />}
          </button>
          <div className="flex-1">
            <p className={`font-medium ${tache.terminee ? 'text-slate-400 dark:text-slate-600 line-through' : 'text-slate-800 dark:text-white'}`}>
              {tache.titre}
            </p>
            <div className="flex gap-3 mt-1">
              {tache.date_limite && (
                <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Calendar size={12} /> {format(new Date(tache.date_limite), 'dd MMM')}
                </p>
              )}
              {tache.heure_rappel && (
                <p className="text-[10px] text-brand-cyan font-medium flex items-center gap-1">
                  <Bell size={10} /> {tache.heure_rappel}
                </p>
              )}
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${
            tache.priorite === 'haute' ? 'bg-rose-500' : 
            tache.priorite === 'moyenne' ? 'bg-amber-500' : 'bg-brand-cyan'
          }`} />
          
          <button 
            onClick={() => setConfirmerSuppression({ id: tache.id })}
            className="absolute right-0 top-0 bottom-0 w-12 bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 flex items-center justify-center translate-x-full group-hover:translate-x-0 transition-transform"
          >
            <Trash2 size={18} />
          </button>
        </Card>
      ))}
      {taches.length === 0 && (
        <div className="text-center py-10 text-slate-400 dark:text-slate-500">
          <p>Aucune tache pour le moment</p>
        </div>
      )}
    </div>
  );
};
