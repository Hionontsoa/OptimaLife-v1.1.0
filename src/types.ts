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

export type CategoryStat = {
  id: number;
  name: string;
  value: number;
  color: string;
  budget: number;
};

export type ReportData = {
  summary: {
    income: number;
    expenses: number;
    balance: number;
    avgDaily: number;
    periodName: string;
  };
  categoryDistribution: any[];
  incomeCategoryDistribution: any[];
  trends: any[];
  topExpenses: Transaction[];
  goals: {
    completed: number;
    inProgress: number;
    avgProgress: number;
  };
  productivity: {
    completed: number;
    pending: number;
    completionRate: number;
  };
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

export type InvestmentInput = {
  nom: string;
  cout_acquisition: string;
  valeur_actuelle: string;
  type: string;
};

export type GoalInput = {
  titre: string;
  montant_cible: string;
  date_limite: string;
  icone: string;
};

export type TransactionInput = {
  montant: string;
  categorie_id: string;
  description: string;
  date: string;
  type: 'revenu' | 'depense';
};
