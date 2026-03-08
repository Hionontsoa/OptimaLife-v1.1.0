import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth, startOfYear, endOfYear, eachMonthOfInterval, isSameMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Header } from '../Communs/Header';
import { Card } from '../Communs/Card';
import { TransactionIcon } from '../Communs/TransactionIcon';
import { CarteResume } from './CarteResume';
import { GraphiqueFinance } from './GraphiqueFinance';
import { useTheme } from '../../Context/ThemeContext';
import { useCurrency } from '../../Context/CurrencyContext';
import { getService } from '../../Services/serviceFactory';
import { Transaction, DashboardSummary, ActivityData } from '../../types';

/**
 * Page d'accueil (Tableau de bord)
 */
export const Accueil = ({ onNavigate }: { onNavigate?: (tab: string) => void }) => {
  const [resume, setResume] = useState<DashboardSummary | null>(null);
  const [periode, setPeriode] = useState('week');
  const [donneesActivite, setDonneesActivite] = useState<ActivityData[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);
  const { currency } = useCurrency();
  const { isDark } = useTheme();

  const recupererDonneesTableauDeBord = async () => {
    try {
      const donnees = await getService().obtenirResumeTableauDeBord();
      setResume(donnees);
      
      const transactions = await getService().obtenirTransactions();
      const maintenant = new Date();
      let dateDebut: Date;
      
      if (periode === 'week') {
        dateDebut = startOfWeek(maintenant, { weekStartsOn: 1 });
        const dateFin = endOfWeek(maintenant, { weekStartsOn: 1 });
        const jours = eachDayOfInterval({ start: dateDebut, end: dateFin });
        
        const donneesGraphique = jours.map(jour => {
          const transacsJour = transactions.filter(t => isSameDay(new Date(t.date), jour));
          return {
            label: format(jour, 'EEE', { locale: fr }),
            revenu: transacsJour.filter(t => t.type === 'revenu').reduce((acc, t) => acc + Number(t.montant), 0),
            depense: transacsJour.filter(t => t.type === 'depense').reduce((acc, t) => acc + Number(t.montant), 0)
          };
        });
        setDonneesActivite(donneesGraphique);
      } else if (periode === 'month') {
        dateDebut = startOfMonth(maintenant);
        const dateFin = endOfMonth(maintenant);
        const jours = eachDayOfInterval({ start: dateDebut, end: dateFin });
        
        const donneesGraphique = jours.map(jour => {
          const transacsJour = transactions.filter(t => isSameDay(new Date(t.date), jour));
          return {
            label: format(jour, 'dd', { locale: fr }),
            revenu: transacsJour.filter(t => t.type === 'revenu').reduce((acc, t) => acc + Number(t.montant), 0),
            depense: transacsJour.filter(t => t.type === 'depense').reduce((acc, t) => acc + Number(t.montant), 0)
          };
        });
        setDonneesActivite(donneesGraphique);
      } else if (periode === 'year') {
        dateDebut = startOfYear(maintenant);
        const dateFin = endOfYear(maintenant);
        const mois = eachMonthOfInterval({ start: dateDebut, end: dateFin });
        
        const donneesGraphique = mois.map(m => {
          const transacsMois = transactions.filter(t => isSameMonth(new Date(t.date), m));
          return {
            label: format(m, 'MMM', { locale: fr }),
            revenu: transacsMois.filter(t => t.type === 'revenu').reduce((acc, t) => acc + Number(t.montant), 0),
            depense: transacsMois.filter(t => t.type === 'depense').reduce((acc, t) => acc + Number(t.montant), 0)
          };
        });
        setDonneesActivite(donneesGraphique);
      }
    } catch (err: any) {
      setErreur(err.message);
    }
  };

  useEffect(() => {
    recupererDonneesTableauDeBord();
  }, [periode]);

  if (erreur) return <div className="p-6 text-rose-500 font-medium">Erreur : {erreur}</div>;
  if (!resume) return <div className="p-6">Chargement...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-24"
    >
      <Header title="Bonjour  " subtitle="Voici l'apercu de votre journee" />
      
      <div className="px-6 space-y-4">
        <CarteResume 
          balance={resume.balance} 
          income={resume.income} 
          expenses={resume.expenses} 
          currency={currency} 
        />

        <GraphiqueFinance 
          donnees={donneesActivite} 
          periode={periode} 
          setPeriode={setPeriode} 
          isDark={isDark} 
        />

        <div className="flex justify-between items-center pt-2">
          <h3 className="font-bold text-slate-800 dark:text-white">Transactions Recentes</h3>
          <button 
            onClick={() => onNavigate?.('finances')}
            className="text-brand-purple dark:text-brand-cyan text-sm font-medium"
          >
            Voir tout
          </button>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {resume.recentTransactions.map((t: Transaction) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TransactionIcon iconName={t.categories?.icon || t.categories?.icone || 'Wallet'} color={t.categories?.couleur || '#6366f1'} />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">{t.description || t.categories?.nom}</p>
                      <p className="text-slate-400 dark:text-slate-500 text-[11px]">{format(new Date(t.date), 'dd MMM yyyy', { locale: fr })}</p>
                    </div>
                  </div>
                  <p className={`font-bold text-sm ${t.type === 'revenu' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {t.type === 'revenu' ? '+' : '-'}{t.montant} {currency}
                  </p>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
