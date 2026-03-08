import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Header } from '../Communs/Header';
import { Card } from '../Communs/Card';
import { ConfirmModal } from '../Communs/ConfirmModal';
import { ListeActions } from './ListeActions';
import { GraphiqueMarche } from './GraphiqueMarche';
import { InvestmentDetailModal } from './InvestmentDetailModal';
import { AddInvestmentModal } from './AddInvestmentModal';
import { useCurrency } from '../../Context/CurrencyContext';
import { getService } from '../../Services/serviceFactory';
import { Investissement } from '../../types';

/**
 * Page de gestion du portefeuille boursier et des investissements
 */
export const Bourse = () => {
  const [investissements, setInvestissements] = useState<Investissement[]>([]);
  const [typeFiltre, setTypeFiltre] = useState('all');
  const [requeteRecherche, setRequeteRecherche] = useState('');
  const [actifSelectionne, setActifSelectionne] = useState<Investissement | null>(null);
  const [afficherAjout, setAfficherAjout] = useState(false);
  const [confirmerSuppression, setConfirmerSuppression] = useState<{ id: number } | null>(null);
  const { currency } = useCurrency();
  
  const [nouvelInv, setNouvelInv] = useState({ nom: '', cout_acquisition: '', valeur_actuelle: '', type: 'stock' });

  const recupererInvestissements = async () => {
    try {
      const donnees = await getService().obtenirInvestissements();
      setInvestissements(donnees);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    recupererInvestissements();
  }, []);

  const gererAjout = async () => {
    if (!nouvelInv.nom || !nouvelInv.cout_acquisition || !nouvelInv.valeur_actuelle) return;
    try {
      await getService().ajouterInvestissement({
        nom: nouvelInv.nom,
        type: nouvelInv.type as any,
        cout_acquisition: parseFloat(nouvelInv.cout_acquisition),
        valeur_actuelle: parseFloat(nouvelInv.valeur_actuelle),
        date_acquisition: new Date().toISOString().split('T')[0]
      });
      setAfficherAjout(false);
      setNouvelInv({ nom: '', cout_acquisition: '', valeur_actuelle: '', type: 'stock' });
      recupererInvestissements();
    } catch (err) {
      console.error(err);
    }
  };

  const supprimerInvestissement = async (id: number) => {
    try {
      await getService().supprimerInvestissement(id);
      recupererInvestissements();
    } catch (err) {
      console.error(err);
    }
  };

  const investissementsFiltres = investissements
    .filter(inv => typeFiltre === 'all' || inv.type === typeFiltre)
    .filter(inv => inv.nom.toLowerCase().includes(requeteRecherche.toLowerCase()));

  const valeurTotale = investissements.reduce((acc, inv) => acc + inv.valeur_actuelle, 0);
  const coutTotal = investissements.reduce((acc, inv) => acc + inv.cout_acquisition, 0);
  const profitTotal = valeurTotale - coutTotal;
  const pCentTotal = coutTotal > 0 ? (profitTotal / coutTotal) * 100 : 0;

  return (
    <div className="pb-24">
      <Header title="Bourse" subtitle="Suivez vos investissements" />
      
      <div className="px-6 space-y-6">
        {/* Resume du Portefeuille */}
        <Card className="bg-slate-900 text-white border-none p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/20 blur-[60px] rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-cyan/20 blur-[40px] rounded-full -ml-12 -mb-12" />
          
          <div className="relative z-10">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Valeur du Portefeuille</p>
            <h2 className="text-4xl font-black tracking-tighter mb-6">{valeurTotale.toLocaleString('fr-FR')} {currency}</h2>
            
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
              <div>
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Profit Total</p>
                <p className={`text-lg font-black ${profitTotal >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {profitTotal >= 0 ? '+' : ''}{profitTotal.toLocaleString('fr-FR')} {currency}
                </p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Performance</p>
                <p className={`text-lg font-black ${profitTotal >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {profitTotal >= 0 ? '+' : ''}{pCentTotal.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Barre de Recherche et Filtres */}
        <div className="space-y-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Rechercher un actif..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 pl-12 pr-4 py-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all text-slate-900 dark:text-white"
              value={requeteRecherche}
              onChange={e => setRequeteRecherche(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['all', 'stock', 'crypto', 'real_estate', 'cash'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFiltre(type)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  typeFiltre === type 
                    ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20' 
                    : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                {type === 'all' ? 'Tous' : 
                 type === 'stock' ? 'Actions' : 
                 type === 'crypto' ? 'Crypto' : 
                 type === 'real_estate' ? 'Immo' : 'Cash'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Vos Actifs ({investissementsFiltres.length})</h3>
          <button 
            onClick={() => setAfficherAjout(true)}
            className="flex items-center gap-1.5 bg-brand-purple dark:bg-brand-cyan text-white dark:text-slate-900 font-black text-[10px] uppercase px-4 py-2.5 rounded-xl shadow-lg shadow-brand-purple/20 dark:shadow-brand-cyan/20 hover:scale-105 transition-transform active:scale-95"
          >
            <Plus size={14} /> Ajouter un actif
          </button>
        </div>

        <ListeActions 
          investissements={investissementsFiltres}
          currency={currency}
          setActifSelectionne={setActifSelectionne}
          setConfirmerSuppression={setConfirmerSuppression}
          requeteRecherche={requeteRecherche}
          setRequeteRecherche={setRequeteRecherche}
        />

        <GraphiqueMarche />
      </div>

      <ConfirmModal 
        isOpen={!!confirmerSuppression}
        onClose={() => setConfirmerSuppression(null)}
        onConfirm={() => confirmerSuppression && supprimerInvestissement(confirmerSuppression.id)}
        title="Supprimer l'actif ?"
        message="Voulez-vous vraiment retirer cet actif de votre portefeuille ? Cette action est irreversible."
      />

      <InvestmentDetailModal 
        isOpen={!!actifSelectionne}
        onClose={() => setActifSelectionne(null)}
        investissement={actifSelectionne}
        currency={currency}
      />

      <AddInvestmentModal 
        afficherAjout={afficherAjout}
        setAfficherAjout={setAfficherAjout}
        nouvelInv={nouvelInv}
        setNouvelInv={setNouvelInv}
        gererAjout={gererAjout}
        currency={currency}
      />
    </div>
  );
};
