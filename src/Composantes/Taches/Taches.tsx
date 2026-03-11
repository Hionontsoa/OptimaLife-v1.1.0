import React, { useState, useEffect } from 'react';
import { Header } from '../Communs/Header';
import { ConfirmModal } from '../Communs/ConfirmModal';
import { AjouterTache } from './AjouterTache';
import { ListeTaches } from './ListeTaches';
import { getService } from '../../Services/serviceFactory';
import { Tache } from '../../types';

/**
 * Page de gestion des tâches
 */
export const Taches = () => {
  const [taches, setTaches] = useState<Tache[]>([]);
  const [nouvelleTache, setNouvelleTache] = useState('');
  const [heureRappel, setHeureRappel] = useState('');
  const [dateLimite, setDateLimite] = useState('');
  const [priorite, setPriorite] = useState<'faible' | 'moyenne' | 'haute'>('moyenne');
  const [afficherRappel, setAfficherRappel] = useState(false);
  const [confirmerSuppression, setConfirmerSuppression] = useState<{ id: number } | null>(null);

  useEffect(() => {
    const chargerTaches = () => getService().obtenirTaches().then(setTaches);
    chargerTaches();

    const subscription = getService().sabonnerAuxChangements('taches', () => {
      chargerTaches();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const basculerTache = async (id: number, terminee: boolean) => {
    try {
      await getService().mettreAJourTache(id, { terminee: !terminee });
      getService().obtenirTaches().then(setTaches);
    } catch (err) {
      console.error(err);
    }
  };

  const supprimerTache = async (id: number) => {
    try {
      await getService().supprimerTache(id);
      setTaches(taches.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const ajouterTache = async () => {
    if (!nouvelleTache) return;
    try {
      await getService().ajouterTache({ 
        titre: nouvelleTache, 
        priorite: priorite,
        heure_rappel: heureRappel || null,
        date_limite: dateLimite || new Date().toISOString().split('T')[0],
        terminee: false
      });
      setNouvelleTache('');
      setHeureRappel('');
      setDateLimite('');
      setPriorite('moyenne');
      setAfficherRappel(false);
      getService().obtenirTaches().then(setTaches);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pb-24">
      <Header title="Taches" subtitle="Restez organise au quotidien" />
      
      <div className="space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <AjouterTache 
              nouvelleTache={nouvelleTache}
              setNouvelleTache={setNouvelleTache}
              ajouterTache={ajouterTache}
              afficherRappel={afficherRappel}
              setAfficherRappel={setAfficherRappel}
              dateLimite={dateLimite}
              setDateLimite={setDateLimite}
              heureRappel={heureRappel}
              setHeureRappel={setHeureRappel}
              priorite={priorite}
              setPriorite={setPriorite}
            />
          </div>

          <div className="lg:col-span-2">
            <ListeTaches 
              taches={taches}
              basculerTache={basculerTache}
              setConfirmerSuppression={setConfirmerSuppression}
            />
          </div>
        </div>

        <ConfirmModal 
          isOpen={!!confirmerSuppression}
          onClose={() => setConfirmerSuppression(null)}
          onConfirm={() => confirmerSuppression && supprimerTache(confirmerSuppression.id)}
          title="Supprimer la tache ?"
          message="Cette action est irreversible. Voulez-vous vraiment supprimer cette tache ?"
        />
      </div>
    </div>
  );
};
