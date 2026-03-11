import React, { useState, useEffect } from 'react';
import { Plus, Settings } from 'lucide-react';
import { isToday } from 'date-fns';
import { Header } from '../Communs/Header';
import { StatistiquesFinance } from './StatistiquesFinance';
import { ListeTransactions } from './ListeTransactions';
import { FormulaireTransaction } from './FormulaireTransaction';
import { ModalBudgets } from './ModalBudgets';
import { useCurrency } from '../../Context/CurrencyContext';
import { getService } from '../../Services/serviceFactory';
import { Transaction, Categorie, CategoryStat, TransactionInput } from '../../types';

/**
 * Page de gestion des finances
 */
export const Finances = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [statsCategories, setStatsCategories] = useState<CategoryStat[]>([]);
  const [afficherAjout, setAfficherAjout] = useState(false);
  const [idCategorieFiltre, setIdCategorieFiltre] = useState<number | null>(null);
  const [categorieSurvolee, setCategorieSurvolee] = useState<CategoryStat | null>(null);
  const [recherche, setRecherche] = useState('');
  const [afficherBudgets, setAfficherBudgets] = useState(false);
  const [categorieEnEdition, setCategorieEnEdition] = useState<Categorie | null>(null);
  const [nouveauBudget, setNouveauBudget] = useState('');
  const { currency } = useCurrency();
  const [nouvelleTransac, setNouvelleTransac] = useState<TransactionInput>({ 
    montant: '', 
    categorie_id: '', 
    description: '', 
    type: 'depense',
    date: new Date().toISOString().split('T')[0]
  });

  const recupererDonnees = async () => {
    try {
      const txs = await getService().obtenirTransactions();
      setTransactions(txs);
      
      const cats = await getService().obtenirCategories();
      setCategories(cats);
      
      const stats = cats.map(cat => {
        const transacsCat = txs.filter(t => t.categorie_id === cat.id && t.type === 'depense');
        return {
          id: cat.id,
          name: cat.nom,
          value: transacsCat.reduce((acc, t) => acc + Number(t.montant), 0),
          color: cat.couleur,
          budget: cat.montant_limite || 0
        };
      }).filter(s => s.value > 0 || s.budget > 0);
      setStatsCategories(stats);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    recupererDonnees();

    const subscription = getService().sabonnerAuxChangements('transactions', () => {
      recupererDonnees();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const gererAjout = async () => {
    if (!nouvelleTransac.montant || !nouvelleTransac.categorie_id) return;
    try {
      await getService().ajouterTransaction({
        montant: parseFloat(nouvelleTransac.montant),
        categorie_id: parseInt(nouvelleTransac.categorie_id),
        description: nouvelleTransac.description,
        type: nouvelleTransac.type as 'revenu' | 'depense',
        date: nouvelleTransac.date
      });
      setAfficherAjout(false);
      setNouvelleTransac({ 
        montant: '', 
        categorie_id: '', 
        description: '', 
        type: 'depense',
        date: new Date().toISOString().split('T')[0]
      });
      recupererDonnees();
    } catch (err) {
      console.error(err);
    }
  };

  const supprimerTransaction = async (id: number) => {
    try {
      await getService().supprimerTransaction(id);
      recupererDonnees();
    } catch (err) {
      console.error(err);
    }
  };

  const gererMiseAJourBudget = async () => {
    if (!categorieEnEdition) return;
    try {
      await getService().mettreAJourCategorie(categorieEnEdition.id, {
        montant_limite: parseFloat(nouveauBudget) || 0
      });
      setCategorieEnEdition(null);
      setNouveauBudget('');
      recupererDonnees();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pb-24">
      <Header title="Finances" subtitle="Gerez vos revenus et depenses" />
      
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-wider">Apercu Financier</h2>
          <button 
            onClick={() => setAfficherBudgets(true)}
            className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm"
          >
            <Settings size={16} /> Budgets
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <StatistiquesFinance 
              statsCategories={statsCategories}
              idCategorieFiltre={idCategorieFiltre}
              setIdCategorieFiltre={setIdCategorieFiltre}
              categorieSurvolee={categorieSurvolee}
              setCategorieSurvolee={setCategorieSurvolee}
              currency={currency}
            />
          </div>

          <div className="lg:col-span-2">
            <ListeTransactions 
              transactions={transactions}
              recherche={recherche}
              setRecherche={setRecherche}
              idCategorieFiltre={idCategorieFiltre}
              currency={currency}
              supprimerTransaction={supprimerTransaction}
            />
          </div>
        </div>
      </div>

      {/* Bouton flottant d'ajout */}
      <button 
        onClick={() => setAfficherAjout(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-brand-purple dark:bg-brand-cyan text-white rounded-full shadow-xl shadow-brand-purple/30 dark:shadow-brand-cyan/30 flex items-center justify-center z-40 active:scale-90 transition-transform"
      >
        <Plus size={28} />
      </button>

      <FormulaireTransaction 
        afficherAjout={afficherAjout}
        setAfficherAjout={setAfficherAjout}
        nouvelleTransac={nouvelleTransac}
        setNouvelleTransac={setNouvelleTransac}
        categories={categories}
        currency={currency}
        gererAjout={gererAjout}
      />

      <ModalBudgets 
        afficherBudgets={afficherBudgets}
        setAfficherBudgets={setAfficherBudgets}
        categories={categories}
        statsCategories={statsCategories}
        currency={currency}
        setCategorieEnEdition={setCategorieEnEdition}
        setNouveauBudget={setNouveauBudget}
        categorieEnEdition={categorieEnEdition}
        nouveauBudget={nouveauBudget}
        gererMiseAJourBudget={gererMiseAJourBudget}
      />
    </div>
  );
};
