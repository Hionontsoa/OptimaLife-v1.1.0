import React from 'react';
import { format } from 'date-fns';
import { Calendar, Bell, CheckSquare, Trash2, Edit2 } from 'lucide-react';
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
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full shrink-0 ${
              tache.priorite === 'haute' ? 'bg-rose-500' : 
              tache.priorite === 'moyenne' ? 'bg-amber-500' : 'bg-brand-cyan'
            }`} />
            
            <div className="flex items-center gap-1 ml-2 border-l border-slate-100 dark:border-slate-800 pl-2">
              <button 
                className="p-2 text-slate-400 hover:text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-colors"
                title="Modifier"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => setConfirmerSuppression({ id: tache.id })}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
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
