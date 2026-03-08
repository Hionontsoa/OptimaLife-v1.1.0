import React from 'react';
import { Wallet } from 'lucide-react';
import { ICONS } from '../../types';

export const TransactionIcon = ({ iconName, color }: { iconName: string, color: string }) => {
  const Icon = (ICONS as any)[iconName] || Wallet;
  return (
    <div 
      className="w-10 h-10 rounded-xl flex items-center justify-center"
      style={{ backgroundColor: `${color}20`, color: color }}
    >
      <Icon size={20} />
    </div>
  );
};
