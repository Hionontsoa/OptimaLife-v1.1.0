import React, { useState } from 'react';
import { Wallet, Cloud, RefreshCw, RotateCcw, ChevronRight, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from '../Communs/Header';
import { Card } from '../Communs/Card';
import { ProfilUtilisateur } from './ProfilUtilisateur';
import { ParametresApplication } from './ParametresApplication';
import { useCurrency } from '../../Context/CurrencyContext';
import { useTheme } from '../../Context/ThemeContext';
import { getService } from '../../Services/serviceFactory';
import { apiFetch } from '../../Utils/api';

interface ReglagesProps {
  onLogout: () => void;
  onNavigate: (tab: string) => void;
}

/**
 * Page de réglages de l'application
 */
export const Reglages = ({ onLogout, onNavigate }: ReglagesProps) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetStatus, setResetStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());
  const [biometricEnabled, setBiometricEnabled] = useState(localStorage.getItem('optima_biometric') === 'true');
  const { currency, setCurrency } = useCurrency();
  const { isDark, toggleTheme } = useTheme();

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastSync(new Date().toLocaleTimeString());
    setIsSyncing(false);
  };

  const updateCurrency = async (newCurrency: string) => {
    setCurrency(newCurrency);
    try {
      await getService().mettreAJourProfil({ currency: newCurrency });
    } catch (err) {
      console.error('Erreur lors de la mise a jour de la devise:', err);
    }
  };

  const toggleBiometric = () => {
    const newValue = !biometricEnabled;
    setBiometricEnabled(newValue);
    localStorage.setItem('optima_biometric', String(newValue));
  };

  const handleReset = async () => {
    setIsSyncing(true);
    setResetStatus('loading');
    try {
      await getService().restaurerDonnees();
      setResetStatus('success');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error(err);
      setResetStatus('error');
      setTimeout(() => setResetStatus('idle'), 3000);
    } finally {
      setIsSyncing(false);
      setShowConfirmReset(false);
    }
  };

  const currencies = [
    { label: 'Euro (€)', value: '€' },
    { label: 'Dollar ($)', value: '$' },
    { label: 'Ariary (Ar)', value: 'Ar' },
    { label: 'Livre (£)', value: '£' },
    { label: 'Yen (¥)', value: '¥' },
    { label: 'Franc (CHF)', value: 'CHF' },
  ];

  return (
    <div className="pb-24">
      <Header title="Reglages" subtitle="Personnalisez votre experience" />
      
      <div className="px-6 space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Preferences</h3>
              <Card className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-purple/10 dark:bg-brand-purple/20 p-2 rounded-xl text-brand-purple dark:text-brand-cyan">
                      <Wallet size={18} />
                    </div>
                    <span className="font-medium text-sm text-slate-800 dark:text-white">Devise</span>
                  </div>
                  <select 
                    value={currency}
                    onChange={(e) => updateCurrency(e.target.value)}
                    className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold focus:outline-none text-slate-900 dark:text-white border border-transparent dark:border-slate-700"
                  >
                    {currencies.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Cloud Sync</h3>
              <Card className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-purple/10 p-2 rounded-xl text-brand-purple">
                    <Cloud size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-800 dark:text-white">Synchronisation Cloud</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">Derniere synchro : {lastSync}</p>
                  </div>
                </div>
                <button 
                  onClick={handleSync}
                  disabled={isSyncing}
                  className={`p-2 rounded-xl transition-all ${isSyncing ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 animate-spin' : 'bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple dark:text-brand-cyan'}`}
                >
                  <RefreshCw size={18} />
                </button>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <ProfilUtilisateur biometricEnabled={biometricEnabled} toggleBiometric={toggleBiometric} onNavigate={onNavigate} />
            <ParametresApplication isDark={isDark} toggleTheme={toggleTheme} />

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Maintenance</h3>
              <Card className="p-0 overflow-hidden">
                <button 
                  onClick={() => setShowConfirmReset(true)}
                  disabled={isSyncing || resetStatus === 'success'}
                  className="w-full p-4 flex items-center justify-between hover:bg-rose-50 dark:hover:bg-rose-900/10 group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-rose-50 dark:bg-rose-900/20 p-2 rounded-xl text-rose-500 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/30 transition-colors">
                      {resetStatus === 'loading' ? <RefreshCw size={18} className="animate-spin" /> : <RotateCcw size={18} />}
                    </div>
                    <span className="font-medium text-rose-600 dark:text-rose-400">
                      {resetStatus === 'success' ? 'Données réinitialisées !' : resetStatus === 'error' ? 'Erreur de réinitialisation' : 'Réinitialiser les données'}
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
                </button>
                <button 
                  onClick={onLogout}
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-slate-500"><LogOut size={18} /></div>
                    <span className="font-medium text-slate-800 dark:text-white">Se deconnecter</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
                </button>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showConfirmReset && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-[32px] p-8 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <RotateCcw size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Tout effacer ?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Cette action supprimera toutes vos transactions, taches et objectifs. C'est irreversible.</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleReset}
                  className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-500/20"
                >
                  Confirmer la suppression
                </button>
                <button 
                  onClick={() => setShowConfirmReset(false)}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-4 rounded-2xl font-bold"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
