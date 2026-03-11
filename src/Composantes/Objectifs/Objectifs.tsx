import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { Header } from '../Communs/Header';
import { ConfirmModal } from '../Communs/ConfirmModal';
import { ListeObjectifs } from './ListeObjectifs';
import { AjouterObjectif } from './AjouterObjectif';
import { ModalDetailObjectif } from './ModalDetailObjectif';
import { useCurrency } from '../../Context/CurrencyContext';
import { getService } from '../../Services/serviceFactory';
import { Objectif, GoalInput } from '../../types';

/**
 * Page de gestion des objectifs financiers
 */
export const Objectifs = () => {
  const [objectifs, setObjectifs] = useState<Objectif[]>([]);
  const [objectifSelectionne, setObjectifSelectionne] = useState<Objectif | null>(null);
  const [montantContribution, setMontantContribution] = useState('');
  const [enCoursDeSoumission, setEnCoursDeSoumission] = useState(false);
  const [confirmerSuppression, setConfirmerSuppression] = useState<{ id: number } | null>(null);
  const { currency } = useCurrency();
  
  const [afficherModalCreation, setAfficherModalCreation] = useState(false);
  const [nouvelObjectif, setNouvelObjectif] = useState<GoalInput>({ titre: '', montant_cible: '', date_limite: '', icone: 'Target' });

  const recupererObjectifs = async () => {
    try {
      const donnees = await getService().obtenirObjectifs();
      setObjectifs(donnees);
      return donnees;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const supprimerObjectif = async (id: number) => {
    try {
      await getService().supprimerObjectif(id);
      setObjectifSelectionne(null);
      await recupererObjectifs();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    recupererObjectifs();

    const subscription = getService().sabonnerAuxChangements('objectifs', () => {
      recupererObjectifs();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const gererClicObjectif = async (goalId: number) => {
    const objectif = objectifs.find(o => o.id === goalId);
    if (objectif) setObjectifSelectionne(objectif);
  };

  const gererContribution = async () => {
    if (!objectifSelectionne || !montantContribution || enCoursDeSoumission) return;
    setEnCoursDeSoumission(true);
    try {
      await getService().ajouterContribution({
        objectif_id: objectifSelectionne.id,
        montant: parseFloat(montantContribution),
        date: new Date().toISOString().split('T')[0]
      });
      setMontantContribution('');
      const nouveauxObjectifs = await recupererObjectifs();
      // Met a jour l'objectif selectionne apres la contribution
      const misAJour = nouveauxObjectifs.find(o => o.id === objectifSelectionne.id);
      if (misAJour) setObjectifSelectionne(misAJour);
    } catch (err) {
      console.error(err);
    } finally {
      setEnCoursDeSoumission(false);
    }
  };

  const gererCreationObjectif = async () => {
    if (!nouvelObjectif.titre || !nouvelObjectif.montant_cible) return;
    try {
      await getService().ajouterObjectif({
        titre: nouvelObjectif.titre,
        montant_cible: parseFloat(nouvelObjectif.montant_cible),
        montant_actuel: 0,
        date_limite: nouvelObjectif.date_limite || null,
        icone: nouvelObjectif.icone
      });
      setAfficherModalCreation(false);
      setNouvelObjectif({ titre: '', montant_cible: '', date_limite: '', icone: 'Target' });
      recupererObjectifs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pb-24">
      <Header title="Objectifs" subtitle="Suivez vos reves financiers" />
      
      <div className="space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ListeObjectifs 
            objectifs={objectifs}
            gererClicObjectif={gererClicObjectif}
            currency={currency}
          />

          <button 
            onClick={() => setAfficherModalCreation(true)}
            className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800 p-6 rounded-2xl text-slate-400 dark:text-slate-500 font-medium flex flex-col items-center justify-center gap-2 h-full min-h-[200px] hover:border-brand-purple hover:text-brand-purple transition-colors bg-slate-50/50 dark:bg-slate-900/50"
          >
            <Target size={32} strokeWidth={1.5} />
            <span className="text-sm font-bold uppercase tracking-wider">Creer un objectif</span>
          </button>
        </div>
      </div>

      <AjouterObjectif 
        afficherModalCreation={afficherModalCreation}
        setAfficherModalCreation={setAfficherModalCreation}
        nouvelObjectif={nouvelObjectif}
        setNouvelObjectif={setNouvelObjectif}
        gererCreationObjectif={gererCreationObjectif}
        currency={currency}
      />

      <ModalDetailObjectif 
        objectifSelectionne={objectifSelectionne}
        setObjectifSelectionne={setObjectifSelectionne}
        setConfirmerSuppression={setConfirmerSuppression}
        montantContribution={montantContribution}
        setMontantContribution={setMontantContribution}
        gererContribution={gererContribution}
        enCoursDeSoumission={enCoursDeSoumission}
        currency={currency}
      />

      <ConfirmModal 
        isOpen={!!confirmerSuppression}
        onClose={() => setConfirmerSuppression(null)}
        onConfirm={() => confirmerSuppression && supprimerObjectif(confirmerSuppression.id)}
        title="Supprimer l'objectif ?"
        message="Cette action est irreversible. Toutes les contributions liees seront egalement supprimees."
      />
    </div>
  );
};
