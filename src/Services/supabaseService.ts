import { format, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '../lib/supabase';
import { Transaction, Categorie, Tache, Objectif, Investissement } from '../types';
import { DEFAULT_CATEGORIES } from '../constants';

// Verifie si Supabase est correctement configure
const verifierSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase n\'est pas configure. Veuillez definir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans les variables d\'environnement.');
  }
};

export const supabaseService = {
  // --- Transactions & Categories ---
  
  // Recupere toutes les transactions de l'utilisateur
  async obtenirTransactions() {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    const { data, error } = await supabase
      .from('transactions')
      .select('*, categories(*)')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    if (error) throw error;
    return data as Transaction[];
  },

  // Recupere toutes les categories (systeme et utilisateur)
  async obtenirCategories() {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Si pas d'utilisateur, on retourne les categories par defaut (mode demo)
    if (!user) {
      return DEFAULT_CATEGORIES;
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Erreur lors de la recuperation des categories:', error);
      return DEFAULT_CATEGORIES;
    }
    
    if (data.length === 0) {
      try {
        await this.initialiserCategories();
        const { data: retryData } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', user.id);
        
        if (retryData && retryData.length > 0) {
          return retryData as Categorie[];
        }
      } catch (err) {
        console.error('Erreur lors de l\'initialisation des categories:', err);
      }
      return DEFAULT_CATEGORIES;
    }
    
    return data as Categorie[];
  },

  // Initialise les categories par defaut pour un nouvel utilisateur
  async initialiserCategories() {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existant } = await supabase
      .from('categories')
      .select('id')
      .eq('user_id', user.id);
    
    if (existant && existant.length > 0) return;

    // On ne garde que les champs necessaires pour la table Supabase
    const categoriesAInserer = DEFAULT_CATEGORIES.map(cat => ({
      nom: cat.nom,
      type: cat.type,
      icone: cat.icone,
      couleur: cat.couleur,
      montant_limite: cat.montant_limite || 0,
      user_id: user.id
    }));

    const { error } = await supabase
      .from('categories')
      .insert(categoriesAInserer);
    
    if (error) {
      console.error('Erreur insertion categories:', error);
      throw error;
    }
  },

  // Ajoute une nouvelle transaction
  async ajouterTransaction(transac: Omit<Transaction, 'id' | 'categories'>) {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...transac, user_id: user.id }])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Supprime une transaction par son ID
  async supprimerTransaction(id: number) {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) throw error;
  },

  // Met a jour une categorie (ex: budget limite)
  async mettreAJourCategorie(id: number, misesAJour: Partial<Categorie>) {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    const { error } = await supabase
      .from('categories')
      .update(misesAJour)
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) throw error;
  },

  // --- Taches ---

  // Recupere toutes les taches de l'utilisateur
  async obtenirTaches() {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    const { data, error } = await supabase
      .from('taches')
      .select('*')
      .eq('user_id', user.id)
      .order('terminee', { ascending: true })
      .order('date_limite', { ascending: true });
    if (error) throw error;
    return data as Tache[];
  },

  // Ajoute une nouvelle tache
  async ajouterTache(tache: Omit<Tache, 'id'>) {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    const { data, error } = await supabase
      .from('taches')
      .insert([{ ...tache, user_id: user.id }])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Met a jour une tache existante
  async mettreAJourTache(id: number, misesAJour: Partial<Tache>) {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    const { error } = await supabase
      .from('taches')
      .update(misesAJour)
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) throw error;
  },

  // Supprime une tache par son ID
  async supprimerTache(id: number) {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    const { error } = await supabase
      .from('taches')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) throw error;
  },

  // --- Objectifs ---

  // Recupere tous les objectifs de l'utilisateur
  async obtenirObjectifs() {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    const { data, error } = await supabase
      .from('objectifs')
      .select('*, contributions(*)')
      .eq('user_id', user.id)
      .order('id', { ascending: true });
    if (error) throw error;
    return data as Objectif[];
  },

  // Ajoute un nouvel objectif
  async ajouterObjectif(objectif: Omit<Objectif, 'id' | 'contributions'>) {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    const { data, error } = await supabase
      .from('objectifs')
      .insert([{ ...objectif, user_id: user.id }])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Supprime un objectif par son ID
  async supprimerObjectif(id: number) {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    const { error } = await supabase
      .from('objectifs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) throw error;
  },

  // Ajoute une contribution a un objectif
  async ajouterContribution(contribution: { objectif_id: number; montant: number; date: string; note?: string }) {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    // Verification de l'objectif
    const { data: objectif, error: fetchError } = await supabase
      .from('objectifs')
      .select('id, montant_actuel')
      .eq('id', contribution.objectif_id)
      .eq('user_id', user.id)
      .single();
    
    if (fetchError || !objectif) throw new Error('Objectif non trouve ou acces refuse');

    // Insertion de la contribution
    const { data, error: insertError } = await supabase
      .from('contributions')
      .insert([{ ...contribution, user_id: user.id }])
      .select();
    
    if (insertError) throw insertError;
    
    // Mise a jour du montant actuel de l'objectif
    const { error: updateError } = await supabase
      .from('objectifs')
      .update({ montant_actuel: (objectif.montant_actuel || 0) + contribution.montant })
      .eq('id', contribution.objectif_id);
    
    if (updateError) {
      console.error('Erreur lors de la mise a jour de l\'objectif:', updateError);
    }
    
    return data[0];
  },

  // --- Investissements ---

  // Recupere tous les investissements de l'utilisateur
  async obtenirInvestissements() {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    if (error) throw error;
    return data as Investissement[];
  },

  // Ajoute un nouvel investissement
  async ajouterInvestissement(invest: Omit<Investissement, 'id'>) {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    const { data, error } = await supabase
      .from('investments')
      .insert([{ ...invest, user_id: user.id }])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Supprime un investissement par son ID
  async supprimerInvestissement(id: number) {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    const { error } = await supabase
      .from('investments')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) throw error;
  },

  // --- Profil ---

  // Recupere le profil de l'utilisateur
  async obtenirProfil() {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Profil n'existe pas encore, on le cree
        const nouveauProfil = {
          id: user.id,
          full_name: user.user_metadata?.full_name || 'Utilisateur',
          avatar_url: user.user_metadata?.avatar_url || '',
          currency: '€'
        };
        const { data: cree, error: errCree } = await supabase
          .from('profiles')
          .insert([nouveauProfil])
          .select()
          .single();
        if (errCree) return nouveauProfil;
        return cree;
      }
      console.error('Erreur lors de la recuperation du profil:', error);
      return null;
    }
    return data;
  },

  // Met a jour le profil
  async mettreAJourProfil(misesAJour: any) {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    const { error } = await supabase
      .from('profiles')
      .update({ ...misesAJour, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    
    if (error) throw error;
  },

  // Televerse un avatar dans le bucket 'avatars'
  async televerserAvatar(fichier: File) {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    const extensionFichier = fichier.name.split('.').pop();
    const nomFichier = `${user.id}-${Math.random()}.${extensionFichier}`;
    const cheminFichier = `${nomFichier}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(cheminFichier, fichier);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(cheminFichier);

    return publicUrl;
  },

  // --- Realtime ---

  // S'abonne aux changements d'une table
  sabonnerAuxChangements(table: string, callback: (payload: any) => void) {
    verifierSupabase();
    return supabase
      .channel(`public:${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
      .subscribe();
  },

  // --- Resumes ---
  
  // Authentification
  async obtenirUtilisateur() {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async deconnexion() {
    verifierSupabase();
    await supabase.auth.signOut();
  },

  // Recupere le resume pour le tableau de bord
  async obtenirResumeTableauDeBord() {
    const transactions = await this.obtenirTransactions();
    const revenus = transactions.filter(t => t.type === 'revenu').reduce((acc, t) => acc + Number(t.montant), 0);
    const depenses = transactions.filter(t => t.type === 'depense').reduce((acc, t) => acc + Number(t.montant), 0);
    const solde = revenus - depenses;
    
    return {
      balance: solde,
      income: revenus,
      expenses: depenses,
      recentTransactions: transactions.slice(0, 5),
      allTransactions: transactions // Ajoute pour eviter de re-fetcher dans Accueil
    };
  },

  // Recupere le resume pour les rapports selon la periode
  async obtenirResumeRapports(periode: 'week' | 'month' | 'year' = 'month', dateRef: Date = new Date()) {
    const transactions = await this.obtenirTransactions();
    const taches = await this.obtenirTaches();
    const objectifs = await this.obtenirObjectifs();

    const objectifsTermines = objectifs.filter(o => o.montant_actuel >= o.montant_cible).length;
    const objectifsEnCours = objectifs.filter(o => o.montant_actuel < o.montant_cible).length;
    const progressionMoyenneObjectifs = objectifs.length > 0 
      ? objectifs.reduce((acc, o) => acc + (Math.min(o.montant_actuel / o.montant_cible, 1)), 0) / objectifs.length * 100 
      : 0;

    const tachesTerminees = taches.filter(t => t.terminee).length;
    const tachesEnAttente = taches.filter(t => !t.terminee).length;
    const tauxCompletionTaches = taches.length > 0 ? (tachesTerminees / taches.length) * 100 : 0;

    const maintenant = dateRef;
    let transactionsFiltrees = transactions;
    let nomPeriode = '';

    if (periode === 'week') {
      const debut = startOfWeek(maintenant, { weekStartsOn: 1 });
      const fin = endOfWeek(maintenant, { weekStartsOn: 1 });
      const { isSameWeek } = await import('date-fns');
      transactionsFiltrees = transactions.filter(t => isSameWeek(new Date(t.date), maintenant, { weekStartsOn: 1 }));
      nomPeriode = `Semaine du ${format(debut, 'dd MMM')} au ${format(fin, 'dd MMM')}`;
    } else if (periode === 'month') {
      const { isSameMonth } = await import('date-fns');
      transactionsFiltrees = transactions.filter(t => isSameMonth(new Date(t.date), maintenant));
      nomPeriode = format(maintenant, 'MMMM yyyy', { locale: fr });
    } else if (periode === 'year') {
      const { isSameYear } = await import('date-fns');
      transactionsFiltrees = transactions.filter(t => isSameYear(new Date(t.date), maintenant));
      nomPeriode = format(maintenant, 'yyyy');
    }

    const revenus = transactionsFiltrees.filter(t => t.type === 'revenu').reduce((acc, t) => acc + Number(t.montant), 0);
    const depenses = transactionsFiltrees.filter(t => t.type === 'depense').reduce((acc, t) => acc + Number(t.montant), 0);
    const solde = revenus - depenses;
    
    let depenseQuotidienneMoyenne = 0;
    const { isSameMonth, isSameYear, isSameWeek, differenceInDays, startOfMonth, endOfMonth, startOfYear, endOfYear } = await import('date-fns');
    const aujourdhui = new Date();

    if (periode === 'week') {
      if (isSameWeek(maintenant, aujourdhui, { weekStartsOn: 1 })) {
        const debut = startOfWeek(aujourdhui, { weekStartsOn: 1 });
        const joursPasses = differenceInDays(aujourdhui, debut) + 1;
        depenseQuotidienneMoyenne = depenses / joursPasses;
      } else {
        depenseQuotidienneMoyenne = depenses / 7;
      }
    } else if (periode === 'month') {
      if (isSameMonth(maintenant, aujourdhui)) {
        depenseQuotidienneMoyenne = depenses / aujourdhui.getDate();
      } else {
        const finMois = endOfMonth(maintenant);
        depenseQuotidienneMoyenne = depenses / finMois.getDate();
      }
    } else if (periode === 'year') {
      if (isSameYear(maintenant, aujourdhui)) {
        const debutAnnee = startOfYear(aujourdhui);
        const joursPasses = differenceInDays(aujourdhui, debutAnnee) + 1;
        depenseQuotidienneMoyenne = depenses / joursPasses;
      } else {
        depenseQuotidienneMoyenne = depenses / 365;
      }
    }

    const carteInfoCategorie = new Map();
    const carteCategorie = new Map();
    const carteCategorieRevenu = new Map();
    const transactionsCategorie = new Map();
    
    transactionsFiltrees
      .filter(t => t.categories)
      .forEach(t => {
        const nomCat = t.categories!.nom;
        const couleurCat = t.categories!.couleur;
        const iconeCat = t.categories!.icon || t.categories!.icone;
        const limiteCat = t.categories!.montant_limite;
        
        carteInfoCategorie.set(nomCat, { color: couleurCat, icon: iconeCat, limit: limiteCat });

        if (t.type === 'depense') {
          const actuel = carteCategorie.get(nomCat) || 0;
          carteCategorie.set(nomCat, actuel + Number(t.montant));
          
          const txs = transactionsCategorie.get(nomCat) || [];
          txs.push(t);
          transactionsCategorie.set(nomCat, txs);
        } else {
          const actuel = carteCategorieRevenu.get(nomCat) || 0;
          carteCategorieRevenu.set(nomCat, actuel + Number(t.montant));
          
          const txs = transactionsCategorie.get(nomCat) || [];
          txs.push(t);
          transactionsCategorie.set(nomCat, txs);
        }
      });
    
    const categoryDistribution = Array.from(carteCategorie.entries()).map(([nom, valeur]) => ({
      name: nom,
      value: valeur,
      color: carteInfoCategorie.get(nom)?.color,
      icon: carteInfoCategorie.get(nom)?.icon,
      limit: carteInfoCategorie.get(nom)?.limit,
      transactions: transactionsCategorie.get(nom) || []
    })).sort((a, b) => b.value - a.value);

    const incomeCategoryDistribution = Array.from(carteCategorieRevenu.entries()).map(([nom, valeur]) => ({
      name: nom,
      value: valeur,
      color: carteInfoCategorie.get(nom)?.color,
      icon: carteInfoCategorie.get(nom)?.icon,
      transactions: transactionsCategorie.get(nom) || []
    })).sort((a, b) => b.value - a.value);

    const topExpenses = transactionsFiltrees
      .filter(t => t.type === 'depense')
      .sort((a, b) => Number(b.montant) - Number(a.montant))
      .slice(0, 5);

    const trends = [];
    if (periode === 'month') {
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const libelleMois = format(d, 'MMM', { locale: fr });
        const transactionsMois = transactions.filter(t => {
          const td = new Date(t.date);
          return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear();
        });
        
        const rev = transactionsMois.filter(t => t.type === 'revenu').reduce((acc, t) => acc + Number(t.montant), 0);
        const dep = transactionsMois.filter(t => t.type === 'depense').reduce((acc, t) => acc + Number(t.montant), 0);
        
        trends.push({
          label: libelleMois,
          income: rev,
          expenses: dep,
          balance: rev - dep
        });
      }
    } else if (periode === 'week') {
      const debut = startOfWeek(maintenant, { weekStartsOn: 1 });
      for (let i = 0; i < 7; i++) {
        const d = new Date(debut);
        d.setDate(d.getDate() + i);
        const libelleJour = format(d, 'EEE', { locale: fr });
        const transactionsJour = transactions.filter(t => isSameDay(new Date(t.date), d));
        
        const rev = transactionsJour.filter(t => t.type === 'revenu').reduce((acc, t) => acc + Number(t.montant), 0);
        const dep = transactionsJour.filter(t => t.type === 'depense').reduce((acc, t) => acc + Number(t.montant), 0);
        
        trends.push({
          label: libelleJour,
          income: rev,
          expenses: dep,
          balance: rev - dep
        });
      }
    } else if (periode === 'year') {
      for (let i = 0; i < 12; i++) {
        const d = new Date(maintenant.getFullYear(), i, 1);
        const libelleMois = format(d, 'MMM', { locale: fr });
        const transactionsMois = transactions.filter(t => {
          const td = new Date(t.date);
          return td.getMonth() === i && td.getFullYear() === maintenant.getFullYear();
        });
        
        const rev = transactionsMois.filter(t => t.type === 'revenu').reduce((acc, t) => acc + Number(t.montant), 0);
        const dep = transactionsMois.filter(t => t.type === 'depense').reduce((acc, t) => acc + Number(t.montant), 0);
        
        trends.push({
          label: libelleMois,
          income: rev,
          expenses: dep,
          balance: rev - dep
        });
      }
    }

    return {
      goals: { completed: objectifsTermines, inProgress: objectifsEnCours, avgProgress: progressionMoyenneObjectifs },
      productivity: { completed: tachesTerminees, pending: tachesEnAttente, completionRate: tauxCompletionTaches },
      summary: { income: revenus, expenses: depenses, balance: solde, avgDaily: depenseQuotidienneMoyenne, periodName: nomPeriode },
      categoryDistribution,
      incomeCategoryDistribution,
      topExpenses,
      trends
    };
  },

  // Restaure les donnees de l'utilisateur
  async restaurerDonnees() {
    verifierSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    const tables = ['contributions', 'transactions', 'taches', 'objectifs', 'investments', 'categories'];
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('user_id', user.id);
      if (error) console.error(`Erreur lors de la suppression de ${table}:`, error);
    }

    await this.initialiserCategories();
  }
};
