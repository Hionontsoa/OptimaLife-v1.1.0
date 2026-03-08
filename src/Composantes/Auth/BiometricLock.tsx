import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Fingerprint } from 'lucide-react';

export const BiometricLock = ({ onUnlock }: { onUnlock: () => void }) => {
  const [error, setError] = useState('');

  const handleBiometric = async () => {
    try {
      // Simulate biometric prompt delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      onUnlock();
    } catch (err) {
      setError("Echec de l'authentification");
    }
  };

  useEffect(() => {
    handleBiometric();
  }, []);

  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-950 z-[100] flex flex-col items-center justify-center p-6 transition-colors duration-300">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <div className="w-24 h-24 bg-brand-purple/10 dark:bg-brand-purple/20 rounded-full flex items-center justify-center mb-8 mx-auto">
          <Fingerprint size={48} className="text-brand-purple dark:text-brand-cyan animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-2 font-display">Acces Securise</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-12 max-w-[280px] mx-auto">Utilisez votre empreinte ou reconnaissance faciale pour deverrouiller OptimaLife</p>
        
        <button 
          onClick={handleBiometric}
          className="bg-brand-purple dark:bg-brand-cyan text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-brand-purple/20 dark:shadow-none flex items-center gap-2 mx-auto active:scale-95 transition-transform"
        >
          <Fingerprint size={20} />
          Reessayer
        </button>
        
        {error && <p className="mt-4 text-rose-500 font-medium">{error}</p>}
      </motion.div>
    </div>
  );
};
