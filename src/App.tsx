import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabase';
import { getService } from './Services/serviceFactory';
import { User } from './types';
import { AuthScreen } from './Composantes/Auth/AuthScreen';
import { BiometricLock } from './Composantes/Auth/BiometricLock';
import { BottomNav } from './Composantes/Communs/BottomNav';
import { Sidebar } from './Composantes/Communs/Sidebar';
import { Accueil } from './Composantes/Accueil/Accueil';
import { Finances } from './Composantes/Finances/Finances';
import { Taches } from './Composantes/Taches/Taches';
import { Objectifs } from './Composantes/Objectifs/Objectifs';
import { Bourse } from './Composantes/Bourse/Bourse';
import { Rapports } from './Composantes/Rapports/Rapports';
import { Reglages } from './Composantes/Reglages/Reglages';
import { Profil } from './Composantes/Profil/Profil';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('accueil');
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Initial check
    const checkInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
        }
      } catch (err) {
        console.error('Error checking initial session:', err);
      } finally {
        setLoading(false);
      }
    };

    checkInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (_token: string, isDemo: boolean = false) => {
    if (isDemo) {
      localStorage.setItem('optima_demo', 'true');
      setUser({ id: 'demo-user', email: 'demo@optima.com' } as any);
    }
    // For real Supabase login, onAuthStateChange will handle the state update
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
      case 'reglages': return <Reglages onLogout={handleLogout} onNavigate={setActiveTab} />;
      case 'profil': return <Profil onBack={() => setActiveTab('reglages')} />;
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex flex-col md:flex-row">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="flex-1 min-h-screen relative bg-white dark:bg-slate-950 overflow-x-hidden overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </div>
  );
};

export default App;
