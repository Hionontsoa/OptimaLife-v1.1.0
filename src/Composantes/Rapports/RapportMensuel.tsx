import React from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Wallet } from 'lucide-react';
import { Card } from '../Communs/Card';

interface RapportMensuelProps {
  donnees: any;
  isDark: boolean;
  currency: string;
  typeCamembert: 'depense' | 'revenu';
  setTypeCamembert: (t: 'depense' | 'revenu') => void;
  setCategorieSelectionnee: (c: any) => void;
}

/**
 * Composant affichant les graphiques et analyses pour un rapport mensuel
 */
export const RapportMensuel = ({ 
  donnees, 
  isDark, 
  currency, 
  typeCamembert, 
  setTypeCamembert, 
  setCategorieSelectionnee 
}: RapportMensuelProps) => {
  const donneesCamembertActuelles = typeCamembert === 'depense' ? donnees.categoryDistribution : donnees.incomeCategoryDistribution;
  const totalPourCamembert = donneesCamembertActuelles.reduce((acc: number, item: any) => acc + item.value, 0);

  return (
    <div className="space-y-6">
      {/* Evolution Interactive */}
      <Card id="trends">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-brand-cyan" size={20} />
            <h3 className="font-bold text-slate-800 dark:text-white">Evolution</h3>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={donnees.trends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: isDark ? '#64748b' : '#94a3b8' }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isDark ? '#64748b' : '#94a3b8' }} />
              <Tooltip 
                cursor={{ fill: isDark ? '#1e293b' : '#f8fafc' }}
                contentStyle={{ 
                  backgroundColor: isDark ? '#0f172a' : '#ffffff',
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  color: isDark ? '#ffffff' : '#000000'
                }}
              />
              <Bar dataKey="income" name="Revenus" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="expenses" name="Depenses" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
              <Line type="monotone" dataKey="balance" name="Solde" stroke="#7000FF" strokeWidth={3} dot={{ r: 4, fill: '#7000FF' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Repartition par Categorie */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <PieChartIcon className="text-brand-purple dark:text-brand-cyan" size={20} />
            <h3 className="font-bold text-slate-800 dark:text-white">Repartition</h3>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => setTypeCamembert('depense')}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${typeCamembert === 'depense' ? 'bg-white dark:bg-slate-700 text-brand-purple dark:text-brand-cyan shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
              Depenses
            </button>
            <button 
              onClick={() => setTypeCamembert('revenu')}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${typeCamembert === 'revenu' ? 'bg-white dark:bg-slate-700 text-brand-purple dark:text-brand-cyan shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
              Revenus
            </button>
          </div>
        </div>
        <div className="h-64 w-full flex flex-col items-center">
          {donneesCamembertActuelles.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={donneesCamembertActuelles}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    onClick={(data) => setCategorieSelectionnee(data)}
                    className="cursor-pointer"
                  >
                    {donneesCamembertActuelles.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color || ['#7000FF', '#00D1FF', '#10B981', '#F59E0B', '#EF4444', '#6366F1'][index % 6]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      color: isDark ? '#ffffff' : '#000000'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full mt-4">
                {donneesCamembertActuelles.slice(0, 4).map((item: any, index: number) => (
                  <button 
                    key={item.name} 
                    onClick={() => setCategorieSelectionnee(item)}
                    className={`flex items-center gap-2 p-1 rounded-lg transition-colors text-left ${item.limit && item.value > item.limit ? 'bg-rose-50 dark:bg-rose-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color || ['#7000FF', '#00D1FF', '#10B981', '#F59E0B', '#EF4444', '#6366F1'][index % 6] }} />
                    <div className="flex flex-col truncate">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase truncate">{item.name}</span>
                      {item.limit && item.value > item.limit && (
                        <span className="text-[8px] font-bold text-rose-500 uppercase">Depassement</span>
                      )}
                    </div>
                    <span className="text-[10px] font-black text-slate-800 dark:text-white ml-auto">{totalPourCamembert > 0 ? Math.round((item.value / totalPourCamembert) * 100) : 0}%</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500">
              <PieChartIcon size={48} className="opacity-20 mb-2" />
              <p className="text-xs italic">Aucune donnee pour cette periode</p>
            </div>
          )}
        </div>
      </Card>

      {/* Top 5 Depenses */}
      <Card id="alerts">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-rose-500" size={20} />
          <h3 className="font-bold text-slate-800 dark:text-white">Top 5 Depenses</h3>
        </div>
        <div className="space-y-4">
          {donnees.topExpenses.map((tx: any) => (
            <div key={tx.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Wallet size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{tx.description}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{tx.categories?.nom}</p>
                </div>
              </div>
              <p className="text-sm font-black text-rose-500">-{tx.montant.toLocaleString('fr-FR')} {currency}</p>
            </div>
          ))}
          {donnees.topExpenses.length === 0 && (
            <p className="text-center text-sm text-slate-400 italic py-4">Aucune depense enregistree</p>
          )}
        </div>
      </Card>
    </div>
  );
};
