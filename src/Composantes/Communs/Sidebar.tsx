import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Wallet, 
  CheckSquare, 
  Target, 
  Settings,
  TrendingUp,
  BarChart3,
  LogOut
} from 'lucide-react';
import { RHLogo } from './RHLogo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (t: string) => void;
  onLogout: () => void;
}

export const Sidebar = ({ activeTab, setActiveTab, onLogout }: SidebarProps) => {
  const tabs = [
    { id: 'accueil', icon: LayoutDashboard, label: 'Tableau de bord' },
    { id: 'finances', icon: Wallet, label: 'Finances' },
    { id: 'taches', icon: CheckSquare, label: 'Tâches' },
    { id: 'objectifs', icon: Target, label: 'Objectifs' },
    { id: 'bourse', icon: TrendingUp, label: 'Bourse' },
    { id: 'rapports', icon: BarChart3, label: 'Rapports' },
    { id: 'reglages', icon: Settings, label: 'Réglages' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 transition-colors duration-300">
      <div className="p-6 flex items-center gap-3">
        <RHLogo size={40} />
        <span className="text-xl font-bold font-display text-slate-900 dark:text-white">OptimaLife</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                isActive 
                  ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-medium text-sm">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors font-medium text-sm"
        >
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};
