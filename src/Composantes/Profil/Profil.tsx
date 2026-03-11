import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, Save, ArrowLeft, Loader2, CheckCircle2, AlertCircle, User as UserIcon } from 'lucide-react';
import { Header } from '../Communs/Header';
import { Card } from '../Communs/Card';
import { useProfile } from '../../Hooks/useProfile';

interface ProfilProps {
  onBack: () => void;
}

export const Profil = ({ onBack }: ProfilProps) => {
  const { profile, loading, error, updateProfile, uploadAvatar } = useProfile();
  const [fullName, setFullName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!fullName.trim()) return;
    setIsSaving(true);
    setStatus('idle');
    
    const result = await updateProfile({ full_name: fullName });
    
    if (result.success) {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
      setErrorMessage(result.error);
    }
    setIsSaving(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatus('idle');
    
    const result = await uploadAvatar(file);
    
    if (result.success) {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
      setErrorMessage(result.error);
    }
    setIsUploading(false);
  };

  if (loading && !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Chargement de votre profil...</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500"
        >
          <ArrowLeft size={20} />
        </button>
        <Header title="Mon Profil" subtitle="Gerez vos informations personnelles" />
      </div>

      <div className="px-6 space-y-6 max-w-2xl mx-auto">
        <Card className="p-8 flex flex-col items-center">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-xl flex items-center justify-center">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserIcon className="w-16 h-16 text-slate-300 dark:text-slate-600" />
              )}
              
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
            
            <div className="absolute bottom-0 right-0 bg-brand-purple text-white p-2.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900 group-hover:scale-110 transition-transform">
              <Camera size={18} />
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>

          <div className="mt-8 w-full space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nom Complet</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Votre nom"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div className="pt-4">
              <button 
                onClick={handleSave}
                disabled={isSaving || !fullName.trim()}
                className="w-full bg-brand-purple dark:bg-brand-cyan text-white dark:text-slate-900 py-4 rounded-2xl font-bold shadow-lg shadow-brand-purple/20 dark:shadow-brand-cyan/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </Card>

        {status === 'success' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 size={20} />
            <p className="text-sm font-medium">Profil mis a jour avec succes !</p>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 p-4 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400"
          >
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{errorMessage || 'Une erreur est survenue'}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
