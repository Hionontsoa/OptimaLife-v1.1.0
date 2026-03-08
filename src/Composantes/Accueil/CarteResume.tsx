import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Card } from '../Communs/Card';

interface CarteResumeProps {
  balance: number;
  income: number;
  expenses: number;
  currency: string;
}

/**
 * Composant affichant le solde total, les revenus et les dépenses
 */
export const CarteResume = ({ balance, income, expenses, currency }: CarteResumeProps) => (
  <Card className="bg-gradient-to-br from-brand-magenta via-brand-purple to-brand-cyan text-white border-none shadow-lg shadow-brand-purple/20">
    <p className="text-white/80 text-sm font-medium">Solde Total</p>
    <h2 className="text-3xl font-bold mt-1">{balance.toLocaleString('fr-FR')} {currency}</h2>
    <div className="flex gap-4 mt-6">
      <div className="flex items-center gap-2">
        <div className="bg-white/20 p-1.5 rounded-full">
          <ArrowUpCircle size={16} className="text-emerald-300" />
        </div>
        <div>
          <p className="text-[10px] text-white/70 uppercase tracking-wider">Revenus</p>
          <p className="font-semibold">+{income} {currency}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-white/20 p-1.5 rounded-full">
          <ArrowDownCircle size={16} className="text-rose-300" />
        </div>
        <div>
          <p className="text-[10px] text-white/70 uppercase tracking-wider">Depenses</p>
          <p className="font-semibold">-{expenses} {currency}</p>
        </div>
      </div>
    </div>
  </Card>
);
