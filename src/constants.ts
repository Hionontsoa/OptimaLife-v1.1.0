import { Categorie } from './types';

export const DEFAULT_CATEGORIES: Categorie[] = [
  // ===== revenus =====
  { id: 1, nom: 'Salaire', type: 'revenu', icone: 'Briefcase', icon: 'Briefcase', couleur: '#10B981' },
  { id: 2, nom: 'Freelance', type: 'revenu', icone: 'Laptop', icon: 'Laptop', couleur: '#3B82F6' },
  { id: 3, nom: 'Business', type: 'revenu', icone: 'Store', icon: 'Store', couleur: '#22C55E' },
  { id: 4, nom: 'Trading', type: 'revenu', icone: 'TrendingUp', icon: 'TrendingUp', couleur: '#059669' },
  { id: 5, nom: 'Investissement', type: 'revenu', icone: 'BarChart', icon: 'BarChart', couleur: '#16A34A' },
  { id: 6, nom: 'Bonus', type: 'revenu', icone: 'Gift', icon: 'Gift', couleur: '#84CC16' },
  { id: 7, nom: 'Location', type: 'revenu', icone: 'Home', icon: 'Home', couleur: '#15803D' },
  { id: 8, nom: 'Autres revenus', type: 'revenu', icone: 'PlusCircle', icon: 'PlusCircle', couleur: '#34D399' },

  // ===== depenses =====
  { id: 9, nom: 'Alimentation', type: 'depense', icone: 'Utensils', icon: 'Utensils', couleur: '#F59E0B' },
  { id: 10, nom: 'Transport', type: 'depense', icone: 'Car', icon: 'Car', couleur: '#EF4444' },
  { id: 11, nom: 'Loyer', type: 'depense', icone: 'Home', icon: 'Home', couleur: '#DC2626' },
  { id: 12, nom: 'Electricite', type: 'depense', icone: 'Zap', icon: 'Zap', couleur: '#F97316' },
  { id: 13, nom: 'Eau', type: 'depense', icone: 'Droplet', icon: 'Droplet', couleur: '#0EA5E9' },
  { id: 14, nom: 'Internet', type: 'depense', icone: 'Wifi', icon: 'Wifi', couleur: '#6366F1' },
  { id: 15, nom: 'Telephone', type: 'depense', icone: 'Smartphone', icon: 'Smartphone', couleur: '#8B5CF6' },
  { id: 16, nom: 'Sante', type: 'depense', icone: 'HeartPulse', icon: 'HeartPulse', couleur: '#EC4899' },
  { id: 17, nom: 'Education', type: 'depense', icone: 'GraduationCap', icon: 'GraduationCap', couleur: '#06B6D4' },
  { id: 18, nom: 'Divertissement', type: 'depense', icone: 'Gamepad', icon: 'Gamepad', couleur: '#A855F7' },
  { id: 19, nom: 'Vetements', type: 'depense', icone: 'Shirt', icon: 'Shirt', couleur: '#F43F5E' },
  { id: 20, nom: 'Abonnements', type: 'depense', icone: 'CreditCard', icon: 'CreditCard', couleur: '#7C3AED' },
  { id: 21, nom: 'Epargne', type: 'depense', icone: 'PiggyBank', icon: 'PiggyBank', couleur: '#14B8A6' },
  { id: 22, nom: 'Don', type: 'depense', icone: 'HandHeart', icon: 'HandHeart', couleur: '#F472B6' },
  { id: 23, nom: 'Autres depenses', type: 'depense', icone: 'MinusCircle', icon: 'MinusCircle', couleur: '#9CA3AF' },
];
