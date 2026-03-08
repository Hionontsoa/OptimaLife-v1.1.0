import React from 'react';
import { Settings, ChevronRight, ShieldCheck, Fingerprint } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../Communs/Card';

interface ProfilUtilisateurProps {
  biometricEnabled: boolean;
  toggleBiometric: () => void;
}

/**
 * Composant affichant les informations de profil et les options de sécurité
 */
export const ProfilUtilisateur = ({ biometricEnabled, toggleBiometric }: ProfilUtilisateurProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Compte</h3>
      <Card className="p-0 overflow-hidden">
        <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-brand-purple/10 dark:bg-brand-purple/20 p-2 rounded-xl text-brand-purple dark:text-brand-cyan">
              <Settings size={18} />
            </div>
            <span className="font-medium text-slate-800 dark:text-white">Profil</span>
          </div>
          <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
        </button>
        <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-xl text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={18} />
            </div>
            <span className="font-medium text-slate-800 dark:text-white">Securite & PIN</span>
          </div>
          <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
        </button>
        <div className="p-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-brand-purple/10 dark:bg-brand-purple/20 p-2 rounded-xl text-brand-purple dark:text-brand-cyan">
              <Fingerprint size={18} />
            </div>
            <span className="font-medium text-slate-800 dark:text-white">Verrouillage Biométrique</span>
          </div>
          <button 
            onClick={toggleBiometric}
            className={`w-12 h-6 rounded-full relative transition-colors ${biometricEnabled ? 'bg-brand-purple dark:bg-brand-cyan' : 'bg-slate-200 dark:bg-slate-800'}`}
          >
            <motion.div 
              animate={{ x: biometricEnabled ? 24 : 4 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
            />
          </button>
        </div>
      </Card>
    </div>
  );
};
