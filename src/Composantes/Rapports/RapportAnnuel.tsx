import React from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend } from 'recharts';
import { TrendingUp, Target, CheckSquare } from 'lucide-react';
import { Card } from '../Communs/Card';
import { ReportData } from '../../types';

interface RapportAnnuelProps {
  donnees: ReportData;
  isDark: boolean;
  currency: string;
}

/**
 * Composant affichant les statistiques annuelles et la productivité
 */
export const RapportAnnuel = ({ donnees, isDark, currency }: RapportAnnuelProps) => {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Statistiques d'Objectifs */}
        <Card id="alerts">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-brand-purple dark:text-brand-cyan" size={20} />
            <h3 className="font-bold text-slate-800 dark:text-white">Statistiques d'Objectifs</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-black text-brand-purple dark:text-brand-cyan">{donnees.goals.completed}</p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Completes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-slate-700 dark:text-slate-300">{donnees.goals.inProgress}</p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">En cours</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-emerald-500 dark:text-emerald-400">{Math.round(donnees.goals.avgProgress)}%</p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Progression</p>
            </div>
          </div>
        </Card>

        {/* Productivite */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare className="text-brand-cyan" size={20} />
            <h3 className="font-bold text-slate-800 dark:text-white">Productivite</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-black text-brand-cyan">{donnees.productivity.completed}</p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Completes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-slate-700 dark:text-slate-300">{donnees.productivity.pending}</p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">En attente</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-brand-purple dark:text-brand-cyan">{Math.round(donnees.productivity.completionRate)}%</p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Taux</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Comparaison Annuelle (Mockup) */}
      <Card id="trends">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-brand-purple" size={20} />
          <h3 className="font-bold text-slate-800 dark:text-white">Comparaison Annuelle</h3>
        </div>
        <div className="h-64 md:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={donnees.trends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
              <Bar dataKey="income" name="Revenus" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Depenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
