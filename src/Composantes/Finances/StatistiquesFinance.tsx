import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { X } from 'lucide-react';
import { Card } from '../Communs/Card';
import { CategoryStat } from '../../types';

interface StatistiquesFinanceProps {
  statsCategories: CategoryStat[];
  idCategorieFiltre: number | null;
  setIdCategorieFiltre: (id: number | null) => void;
  categorieSurvolee: CategoryStat | null;
  setCategorieSurvolee: (cat: CategoryStat | null) => void;
  currency: string;
}

/**
 * Composant affichant la répartition des dépenses par catégorie sous forme de graphique camembert
 */
export const StatistiquesFinance = ({ 
  statsCategories, 
  idCategorieFiltre, 
  setIdCategorieFiltre, 
  categorieSurvolee, 
  setCategorieSurvolee,
  currency 
}: StatistiquesFinanceProps) => {
  if (statsCategories.length === 0) return null;

  return (
    <Card className="p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">Depenses par categorie</h3>
        {idCategorieFiltre && (
          <button 
            onClick={() => setIdCategorieFiltre(null)}
            className="text-[10px] font-bold text-brand-purple dark:text-brand-cyan bg-brand-purple/10 dark:bg-brand-cyan/10 px-2 py-1 rounded-lg flex items-center gap-1"
          >
            Effacer le filtre <X size={10} />
          </button>
        )}
      </div>
      <div className="h-48 w-full flex items-center">
        <div className="w-1/2 h-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statsCategories}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                onClick={(data) => setIdCategorieFiltre(data.id === idCategorieFiltre ? null : data.id)}
                onMouseEnter={(data) => setCategorieSurvolee(data)}
                onMouseLeave={() => setCategorieSurvolee(null)}
                className="cursor-pointer"
              >
                {statsCategories.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    opacity={idCategorieFiltre ? (entry.id === idCategorieFiltre ? 1 : 0.3) : 1}
                    style={{ 
                      filter: categorieSurvolee?.id === entry.id ? 'brightness(1.1)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 text-[10px]">
                        <p className="font-bold text-slate-800 dark:text-white">{payload[0].name}</p>
                        <p className="font-medium text-brand-purple dark:text-brand-cyan">{payload[0].value} {currency}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
              {categorieSurvolee ? categorieSurvolee.name : (idCategorieFiltre ? statsCategories.find(s => s.id === idCategorieFiltre)?.name : 'Total')}
            </p>
            <p className="text-xs font-black text-slate-800 dark:text-white">
              {categorieSurvolee ? categorieSurvolee.value : (idCategorieFiltre ? statsCategories.find(s => s.id === idCategorieFiltre)?.value : statsCategories.reduce((acc, s) => acc + s.value, 0))} {currency}
            </p>
          </div>
        </div>
        <div className="w-1/2 space-y-1.5 pl-4">
          {statsCategories.map((stat, i) => (
            <button 
              key={i} 
              onClick={() => setIdCategorieFiltre(stat.id === idCategorieFiltre ? null : stat.id)}
              className={`w-full flex items-center gap-2 p-1 rounded-lg transition-all ${idCategorieFiltre === stat.id ? 'bg-slate-50 dark:bg-slate-800' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/50'}`}
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: stat.color }} />
              <div className="min-w-0 flex-1 text-left">
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase truncate">{stat.name}</p>
                <p className="text-[11px] font-black text-slate-800 dark:text-white">{stat.value} {currency}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};
