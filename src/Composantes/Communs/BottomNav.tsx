import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Wallet, 
  CheckSquare, 
  Target, 
  Settings,
  TrendingUp,
  BarChart3
} from 'lucide-react';

export const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: 'accueil', icon: LayoutDashboard, label: 'Accueil' },
    { id: 'finances', icon: Wallet, label: 'Finances' },
    { id: 'taches', icon: CheckSquare, label: 'Taches' },
    { id: 'objectifs', icon: Target, label: 'Objectifs' },
    { id: 'bourse', icon: TrendingUp, label: 'Bourse' },
    { id: 'rapports', icon: BarChart3, label: 'Rapports' },
    { id: 'reglages', icon: Settings, label: 'Reglages' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200/50 dark:border-slate-800/50 px-4 pb-safe pt-3 flex justify-around items-center z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] transition-colors duration-300">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileTap={{ scale: 0.9 }}
            className="relative flex flex-col items-center gap-1 group py-1"
          >
            <div className="relative z-10">
              <motion.div
                animate={{
                  scale: isActive ? 1.2 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`${isActive ? 'text-brand-purple' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}
              >
                <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
            </div>

            <motion.span 
              animate={{
                opacity: isActive ? 1 : 0.6,
                scale: isActive ? 1 : 0.9,
              }}
              className={`text-[10px] font-bold relative z-10 ${isActive ? 'text-brand-purple' : 'text-slate-400 dark:text-slate-500'}`}
            >
              {tab.label}
            </motion.span>

            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -top-1 inset-x-0 h-1 bg-brand-purple rounded-full mx-auto w-6"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            
            {isActive && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-brand-purple/5 rounded-xl -z-0"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
};
