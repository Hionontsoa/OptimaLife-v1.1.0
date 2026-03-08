import { Transaction, Categorie, Tache, Objectif, Investissement } from '../types';
import { DEFAULT_CATEGORIES } from '../constants';

// Cles de stockage pour le localStorage
const CLES_STOCKAGE = {
  TRANSACTIONS: 'demo_transactions',
  TACHES: 'demo_tasks',
  OBJECTIFS: 'demo_goals',
  CONTRIBUTIONS: 'demo_contributions',
  INVESTISSEMENTS: 'demo_investments',
  CATEGORIES: 'demo_categories'
};

// Fonction utilitaire pour recuperer des donnees du stockage local
const obtenirStockage = <T>(cle: string, valeurParDefaut: T): T => {
  const donnees = localStorage.getItem(cle);
  return donnees ? JSON.parse(donnees) : valeurParDefaut;
};

// Fonction utilitaire pour enregistrer des donnees dans le stockage local
const enregistrerStockage = <T>(cle: string, donnees: T) => {
  localStorage.setItem(cle, JSON.stringify(donnees));
};

export const mockService = {
  // Recupere toutes les transactions
  async obtenirTransactions() {
    return obtenirStockage<Transaction[]>(CLES_STOCKAGE.TRANSACTIONS, []);
  },

  // Recupere toutes les categories
  async obtenirCategories() {
    return obtenirStockage<Categorie[]>(CLES_STOCKAGE.CATEGORIES, DEFAULT_CATEGORIES);
  },

  // Initialise les categories par defaut si elles n'existent pas
  async initialiserCategories() {
    const existant = await this.obtenirCategories();
    if (existant.length === 0) {
      enregistrerStockage(CLES_STOCKAGE.CATEGORIES, DEFAULT_CATEGORIES);
    }
  },

  // Met a jour une categorie (ex: budget limite)
  async mettreAJourCategorie(id: number, misesAJour: Partial<Categorie>) {
    const categories = await this.obtenirCategories();
    enregistrerStockage(CLES_STOCKAGE.CATEGORIES, categories.map(c => c.id === id ? { ...c, ...misesAJour } : c));
  },

  // Ajoute une nouvelle transaction
  async ajouterTransaction(transac: Omit<Transaction, 'id' | 'categories'>) {
    const transactions = await this.obtenirTransactions();
    const categories = await this.obtenirCategories();
    const categorie = categories.find(c => c.id === transac.categorie_id);
    
    const nouvelleTransac = { 
      ...transac, 
      id: Date.now(),
      categories: categorie
    } as Transaction;
    
    enregistrerStockage(CLES_STOCKAGE.TRANSACTIONS, [nouvelleTransac, ...transactions]);
    return nouvelleTransac;
  },

  // Supprime une transaction par son ID
  async supprimerTransaction(id: number) {
    const transactions = await this.obtenirTransactions();
    enregistrerStockage(CLES_STOCKAGE.TRANSACTIONS, transactions.filter(t => t.id !== id));
  },

  // Recupere toutes les taches
  async obtenirTaches() {
    return obtenirStockage<Tache[]>(CLES_STOCKAGE.TACHES, []);
  },

  // Ajoute une nouvelle tache
  async ajouterTache(tache: Omit<Tache, 'id'>) {
    const taches = await this.obtenirTaches();
    const nouvelleTache = { ...tache, id: Date.now() } as Tache;
    enregistrerStockage(CLES_STOCKAGE.TACHES, [...taches, nouvelleTache]);
    return nouvelleTache;
  },

  // Met a jour une tache existante
  async mettreAJourTache(id: number, misesAJour: Partial<Tache>) {
    const taches = await this.obtenirTaches();
    enregistrerStockage(CLES_STOCKAGE.TACHES, taches.map(t => t.id === id ? { ...t, ...misesAJour } : t));
  },

  // Supprime une tache par son ID
  async supprimerTache(id: number) {
    const taches = await this.obtenirTaches();
    enregistrerStockage(CLES_STOCKAGE.TACHES, taches.filter(t => t.id !== id));
  },

  // Recupere tous les objectifs avec leurs contributions
  async obtenirObjectifs() {
    const objectifs = obtenirStockage<Objectif[]>(CLES_STOCKAGE.OBJECTIFS, []);
    const contributions = obtenirStockage<any[]>(CLES_STOCKAGE.CONTRIBUTIONS, []);
    
    return objectifs.map(o => ({
      ...o,
      contributions: contributions.filter(c => c.objectif_id === o.id)
    }));
  },

  // Ajoute un nouvel objectif
  async ajouterObjectif(objectif: Omit<Objectif, 'id' | 'contributions'>) {
    const objectifs = await this.obtenirObjectifs();
    const nouvelObjectif = { ...objectif, id: Date.now(), contributions: [] } as Objectif;
    enregistrerStockage(CLES_STOCKAGE.OBJECTIFS, [...objectifs, nouvelObjectif]);
    return nouvelObjectif;
  },

  // Supprime un objectif par son ID
  async supprimerObjectif(id: number) {
    const objectifs = await this.obtenirObjectifs();
    enregistrerStockage(CLES_STOCKAGE.OBJECTIFS, objectifs.filter(o => o.id !== id));
  },

  // Ajoute une contribution a un objectif
  async ajouterContribution(contribution: { objectif_id: number; montant: number; date: string; note?: string }) {
    const contributions = obtenirStockage<any[]>(CLES_STOCKAGE.CONTRIBUTIONS, []);
    const nouvelleContribution = { ...contribution, id: Date.now() };
    enregistrerStockage(CLES_STOCKAGE.CONTRIBUTIONS, [...contributions, nouvelleContribution]);
    
    const objectifs = obtenirStockage<Objectif[]>(CLES_STOCKAGE.OBJECTIFS, []);
    enregistrerStockage(CLES_STOCKAGE.OBJECTIFS, objectifs.map(o => 
      o.id === contribution.objectif_id 
        ? { ...o, montant_actuel: (o.montant_actuel || 0) + contribution.montant } 
        : o
    ));
    
    return nouvelleContribution;
  },

  // Recupere tous les investissements
  async obtenirInvestissements() {
    return obtenirStockage<Investissement[]>(CLES_STOCKAGE.INVESTISSEMENTS, []);
  },

  // Ajoute un nouvel investissement
  async ajouterInvestissement(invest: Omit<Investissement, 'id'>) {
    const investissements = await this.obtenirInvestissements();
    const nouvelInvest = { ...invest, id: Date.now() } as Investissement;
    enregistrerStockage(CLES_STOCKAGE.INVESTISSEMENTS, [...investissements, nouvelInvest]);
    return nouvelInvest;
  },

  // Supprime un investissement par son ID
  async supprimerInvestissement(id: number) {
    const investissements = await this.obtenirInvestissements();
    enregistrerStockage(CLES_STOCKAGE.INVESTISSEMENTS, investissements.filter(i => i.id !== id));
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
      recentTransactions: transactions.slice(0, 5)
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

    // Importation dynamique pour la coherence
    const { startOfWeek, endOfWeek, format, isSameDay } = await import('date-fns');
    const { fr } = await import('date-fns/locale');

    if (periode === 'week') {
      const { startOfWeek, endOfWeek, isSameWeek } = await import('date-fns');
      const debut = startOfWeek(maintenant, { weekStartsOn: 1 });
      const fin = endOfWeek(maintenant, { weekStartsOn: 1 });
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

    // Repartition par categorie
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

    // Top 5 des depenses
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
        trends.push({ label: libelleMois, income: rev, expenses: dep, balance: rev - dep });
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
        trends.push({ label: libelleJour, income: rev, expenses: dep, balance: rev - dep });
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
        trends.push({ label: libelleMois, income: rev, expenses: dep, balance: rev - dep });
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

  // Authentification
  async obtenirUtilisateur() {
    const token = localStorage.getItem('optima_token');
    if (!token) return null;
    return { id: 'demo-user', email: 'demo@optima.com', user_metadata: { full_name: 'Utilisateur Demo' } };
  },

  async deconnexion() {
    localStorage.removeItem('optima_token');
    localStorage.removeItem('optima_demo');
  },

  // Restaure les donnees par defaut
  async restaurerDonnees() {
    Object.values(CLES_STOCKAGE).forEach(cle => localStorage.removeItem(cle));
    await this.initialiserCategories();
  }
};
