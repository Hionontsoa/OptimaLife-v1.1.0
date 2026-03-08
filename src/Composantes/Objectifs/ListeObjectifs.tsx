import React from 'react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { AlertCircle, Target } from 'lucide-react';
import { Card } from '../Communs/Card';
import { Objectif, ICONS } from '../../types';

interface ListeObjectifsProps {
  objectifs: Objectif[];
  gererClicObjectif: (id: number) => void;
  currency: string;
}

/**
 * Liste des objectifs financiers avec barres de progression
 */
export const ListeObjectifs = ({ objectifs, gererClicObjectif, currency }: ListeObjectifsProps) => {
  return (
    <div className="space-y-4">
      {objectifs.map(objectif => {
        const progression = (objectif.montant_actuel / objectif.montant_cible) * 100;
        const estProcheCible = progression >= 90 && progression < 100;
        const Icon = (ICONS as any)[objectif.icone] || Target;
        
        return (
          <Card 
            key={objectif.id} 
            className="cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => gererClicObjectif(objectif.id)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-brand-purple/10 dark:bg-brand-cyan/10 text-brand-purple dark:text-brand-cyan rounded-xl flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800 dark:text-white">{objectif.titre}</h3>
                    {estProcheCible && (
                      <motion.span 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm shadow-amber-100 dark:shadow-none"
                      >
                        <AlertCircle size={10} /> Presque la !
                      </motion.span>
                    )}
                    {progression >= 100 && (
                      <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        Complete
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 dark:text-slate-500 text-xs">Echeance : {objectif.date_limite ? format(new Date(objectif.date_limite), 'dd MMM yyyy') : 'Non definie'}</p>
                </div>
              </div>
              <div className="bg-brand-purple/10 dark:bg-brand-cyan/10 text-brand-purple dark:text-brand-cyan px-2 py-1 rounded-lg text-[10px] font-bold">
                {Math.round(progression)}%
              </div>
            </div>
            
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progression, 100)}%` }}
                className={`h-full rounded-full ${
                  progression >= 100 ? 'bg-emerald-500' : 
                  estProcheCible ? 'bg-amber-500' : 'bg-brand-purple dark:bg-brand-cyan'
                }`}
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <p className="font-bold text-slate-800 dark:text-white">{objectif.montant_actuel.toLocaleString('fr-FR')} {currency}</p>
              <p className="text-slate-400 dark:text-slate-500">Cible : {objectif.montant_cible.toLocaleString('fr-FR')} {currency}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
