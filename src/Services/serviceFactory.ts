import { supabaseService } from './supabaseService';
import { mockService } from './mockService';

/**
 * Retourne le service de données approprié (Supabase ou Mock/Démo)
 */
export const getService = () => {
  const isDemo = localStorage.getItem('optima_demo') === 'true';
  return isDemo ? mockService : supabaseService;
};
