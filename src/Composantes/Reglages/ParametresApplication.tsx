import React from 'react';
import { LayoutDashboard, Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../Communs/Card';

interface ParametresApplicationProps {
  isDark: boolean;
  toggleTheme: () => void;
}

/**
 * Composant pour les réglages de l'interface de l'application
 */
export const ParametresApplication = ({ isDark, toggleTheme }: ParametresApplicationProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Application</h3>
      <Card className="p-0 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-brand-purple/10 dark:bg-brand-purple/20 p-2 rounded-xl text-brand-purple dark:text-brand-cyan">
              <LayoutDashboard size={18} />
            </div>
            <span className="font-medium text-slate-800 dark:text-white">Mode Sombre</span>
          </div>
          <button 
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full relative transition-colors ${isDark ? 'bg-brand-purple dark:bg-brand-cyan' : 'bg-slate-200 dark:bg-slate-800'}`}
          >
            <motion.div 
              animate={{ x: isDark ? 24 : 4 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
            />
          </button>
        </div>
        <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-brand-cyan/10 dark:bg-brand-cyan/20 p-2 rounded-xl text-brand-cyan">
              <Calendar size={18} />
            </div>
            <span className="font-medium text-slate-800 dark:text-white">Notifications</span>
          </div>
          <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
        </button>
      </Card>
    </div>
  );
};
