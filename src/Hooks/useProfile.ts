import { useState, useEffect } from 'react';
import { getService } from '../Services/serviceFactory';

export const useProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getService().obtenirProfil();
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      await getService().mettreAJourProfil(updates);
      await fetchProfile();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      const publicUrl = await getService().televerserAvatar(file);
      await updateProfile({ avatar_url: publicUrl });
      return { success: true, url: publicUrl };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    refreshProfile: fetchProfile
  };
};
