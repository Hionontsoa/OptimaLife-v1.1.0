import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { getService } from './Services/serviceFactory';
import { User } from './types';
import { AuthScreen } from './Composantes/Auth/AuthScreen';
import { BiometricLock } from './Composantes/Auth/BiometricLock';
import { BottomNav } from './Composantes/Communs/BottomNav';
import { Accueil } from './Composantes/Accueil/Accueil';
import { Finances } from './Composantes/Finances/Finances';
import { Taches } from './Composantes/Taches/Taches';
import { Objectifs } from './Composantes/Objectifs/Objectifs';
import { Bourse } from './Composantes/Bourse/Bourse';
import { Rapports } from './Composantes/Rapports/Rapports';
import { Reglages } from './Composantes/Reglages/Reglages';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('accueil');
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getService().obtenirUtilisateur();
        setUser(currentUser);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleLogin = async (token: string, isDemo: boolean = false) => {
    localStorage.setItem('optima_token', token);
    if (isDemo) localStorage.setItem('optima_demo', 'true');
    
    setLoading(true);
    try {
      const currentUser = await getService().obtenirUtilisateur();
      setUser(currentUser);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await getService().deconnexion();
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'accueil': return <Accueil onNavigate={setActiveTab} />;
      case 'finances': return <Finances />;
      case 'taches': return <Taches />;
      case 'objectifs': return <Objectifs />;
      case 'bourse': return <Bourse />;
      case 'rapports': return <Rapports />;
      case 'reglages': return <Reglages onLogout={handleLogout} />;
      default: return <Accueil onNavigate={setActiveTab} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const biometricEnabled = localStorage.getItem('optima_biometric') === 'true';
  if (biometricEnabled && !isUnlocked) {
    return <BiometricLock onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <main className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-white dark:bg-slate-950 overflow-hidden">
        <AnimatePresence mode="wait">
          <div key={activeTab}>
            {renderScreen()}
          </div>
        </AnimatePresence>
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </div>
  );
};

export default App;
