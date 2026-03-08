import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card } from '../Communs/Card';

interface GraphiqueFinanceProps {
  donnees: any[];
  periode: string;
  setPeriode: (p: string) => void;
  isDark: boolean;
}

/**
 * Graphique d'activité financière montrant les revenus et dépenses
 */
export const GraphiqueFinance = ({ donnees, periode, setPeriode, isDark }: GraphiqueFinanceProps) => (
  <Card>
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Activite</h3>
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
        {['week', 'month', 'year'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriode(p)}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
              periode === p 
                ? 'bg-white dark:bg-slate-700 text-brand-purple dark:text-brand-cyan shadow-sm' 
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Annee'}
          </button>
        ))}
      </div>
    </div>
    
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={donnees}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: isDark ? '#64748b' : '#94a3b8' }}
            minTickGap={20}
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
              fontSize: '12px',
              fontWeight: 'bold',
              color: isDark ? '#ffffff' : '#000000'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="revenu" 
            stroke="#10B981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorIncome)" 
            name="Revenus"
          />
          <Area 
            type="monotone" 
            dataKey="depense" 
            stroke="#EF4444" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorExpense)" 
            name="Depenses"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    
    <div className="flex justify-center gap-6 mt-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Revenus</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-rose-500" />
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Depenses</span>
      </div>
    </div>
  </Card>
);
