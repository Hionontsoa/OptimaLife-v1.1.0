import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, UserPlus, User, RotateCcw, Fingerprint } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { RHLogo } from '../Communs/RHLogo';

export const AuthScreen = ({ onLogin }: { onLogin: (token: string, isDemo?: boolean) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!supabase) {
      setError("Supabase n'est pas configure. Veuillez verifier vos variables d'environnement.");
      return;
    }
    
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (error) throw error;
        if (data.session) {
          onLogin(data.session.access_token, false);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });
        if (error) throw error;
        if (data.session) {
          onLogin(data.session.access_token, false);
        } else {
          setSuccess('Inscription réussie ! Un e-mail de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.');
        }
      }
    } catch (err: any) {
      let msg = err.message || 'Une erreur est survenue';
      if (msg.includes('rate limit')) {
        msg = "Trop de tentatives. Veuillez patienter quelques minutes avant de reessayer ou verifiez les limites de debit dans votre tableau de bord Supabase.";
      }
      setError(msg);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    if (!supabase) {
      setError("Supabase n'est pas configure.");
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      if (data.session) {
        onLogin(data.session.access_token, false);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors duration-300">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800"
      >
        <div className="flex justify-center mb-6">
          <RHLogo size={80} />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2 font-display text-brand-dark dark:text-white">OptimaLife</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-8">
          {isLogin ? 'Connectez-vous pour synchroniser vos donnees' : 'Creez un compte pour sauvegarder vos donnees'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email</label>
            <input 
              type="email" 
              placeholder="votre@gmail.com"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple text-slate-900 dark:text-white"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Mot de passe</label>
            <input 
              type="password" 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple text-slate-900 dark:text-white"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <p className="text-rose-500 text-xs text-center font-medium bg-rose-50 dark:bg-rose-900/20 p-3 rounded-xl">{error}</p>}
          {success && <p className="text-emerald-600 dark:text-emerald-400 text-xs text-center font-bold bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800 animate-pulse">{success}</p>}

          <button 
            type="submit"
            className="w-full bg-brand-purple dark:bg-brand-cyan text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-purple/20 dark:shadow-none flex items-center justify-center gap-2"
          >
            {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
            {isLogin ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-6 text-sm text-brand-purple dark:text-brand-cyan font-medium"
        >
          {isLogin ? "Pas encore de compte ? S'inscrire" : "Deja un compte ? Se connecter"}
        </button>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <button 
            onClick={handleGuestLogin}
            className="w-full bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple dark:text-brand-cyan py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-purple/20 dark:hover:bg-brand-purple/30 transition-colors"
          >
            <User size={20} />
            Mode Invite (Supabase)
          </button>

          <button 
            onClick={() => {
              onLogin('demo-token', true);
            }}
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw size={20} />
            Mode Demo (Local)
          </button>
        </div>
      </motion.div>
    </div>
  );
};
