import { 
  LayoutDashboard, 
  Wallet, 
  CheckSquare, 
  Target, 
  Settings,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  Utensils,
  Car,
  GraduationCap,
  TrendingUp,
  Gamepad,
  Briefcase,
  ShoppingBag,
  HeartPulse,
  Home,
  Laptop,
  Store,
  BarChart,
  Gift,
  PlusCircle,
  Zap,
  Droplet,
  Wifi,
  Smartphone,
  Shirt,
  CreditCard,
  PiggyBank,
  HandHeart,
  MinusCircle
} from 'lucide-react';

export const ICONS = {
  LayoutDashboard,
  Wallet,
  CheckSquare,
  Target,
  Settings,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  Utensils,
  Car,
  GraduationCap,
  TrendingUp,
  Gamepad,
  Briefcase,
  ShoppingBag,
  HeartPulse,
  Home,
  Laptop,
  Store,
  BarChart,
  Gift,
  PlusCircle,
  Zap,
  Droplet,
  Wifi,
  Smartphone,
  Shirt,
  CreditCard,
  PiggyBank,
  HandHeart,
  MinusCircle
};

export type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
};

export type DashboardSummary = {
  balance: number;
  income: number;
  expenses: number;
  recentTransactions: Transaction[];
};

export type ActivityData = {
  label: string;
  revenu: number;
  depense: number;
};

export type Transaction = {
  id: number;
  montant: number;
  categorie_id: number;
  description: string;
  date: string;
  type: 'revenu' | 'depense';
  categories?: Categorie;
};

export type Categorie = {
  id: number;
  nom: string;
  type: 'revenu' | 'depense';
  icone: string;
  icon?: string;
  couleur: string;
  montant_limite?: number;
};

export type Tache = {
  id: number;
  titre: string;
  terminee: boolean;
  date_limite: string;
  heure_rappel?: string;
  priorite: 'faible' | 'moyenne' | 'haute';
};

export type Objectif = {
  id: number;
  titre: string;
  montant_cible: number;
  montant_actuel: number;
  date_limite: string;
  icone: string;
  contributions?: Contribution[];
};

export type Contribution = {
  id: number;
  objectif_id: number;
  montant: number;
  date: string;
  note?: string;
};

export type Investissement = {
  id: number;
  nom: string;
  cout_acquisition: number;
  valeur_actuelle: number;
  type: string;
  date: string;
};
