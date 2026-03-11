import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth, startOfYear, endOfYear, eachMonthOfInterval, isSameMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { User as UserIcon } from 'lucide-react';
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
  const [profil, setProfil] = useState<any>(null);
  const [periode, setPeriode] = useState('week');
  const [donneesActivite, setDonneesActivite] = useState<ActivityData[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const { currency } = useCurrency();
  const { isDark } = useTheme();

  const recupererDonneesTableauDeBord = async () => {
    try {
      const [donnees, profilData] = await Promise.all([
        getService().obtenirResumeTableauDeBord(),
        getService().obtenirProfil()
      ]);
      
      setResume(donnees);
      setProfil(profilData);
      
      // Utilise les transactions deja recuperees par obtenirResumeTableauDeBord
      const transactions = (donnees as any).allTransactions || [];
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
      setChargement(false);
    } catch (err: any) {
      setErreur(err.message);
      setChargement(false);
    }
  };

  useEffect(() => {
    recupererDonneesTableauDeBord();

    // Realtime subscription
    const subscription = getService().sabonnerAuxChangements('transactions', () => {
      recupererDonneesTableauDeBord();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [periode]);

  if (erreur) return <div className="p-6 text-rose-500 font-medium">Erreur : {erreur}</div>;
  if (chargement) return <div className="p-6">Chargement...</div>;

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between px-6 pt-4">
        <Header 
          title={`Bonjour, ${profil?.full_name || 'Utilisateur'} 👋`} 
          subtitle="Voici l'apercu de votre journee" 
        />
        <div 
          onClick={() => onNavigate?.('profil')}
          className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 shadow-md cursor-pointer hover:scale-105 transition-transform shrink-0"
        >
          {profil?.avatar_url ? (
            <img src={profil.avatar_url} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <UserIcon size={24} />
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs">Transactions Recentes</h3>
              <button 
                onClick={() => onNavigate?.('finances')}
                className="text-brand-purple dark:text-brand-cyan text-xs font-bold uppercase tracking-tight"
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
                    <Card className="p-3 flex items-center justify-between hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 min-w-0">
                        <TransactionIcon iconName={t.categories?.icon || t.categories?.icone || 'Wallet'} color={t.categories?.couleur || '#6366f1'} />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{t.description || t.categories?.nom}</p>
                          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-medium">{format(new Date(t.date), 'dd MMM yyyy', { locale: fr })}</p>
                        </div>
                      </div>
                      <p className={`font-black text-sm shrink-0 ${t.type === 'revenu' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                        {t.type === 'revenu' ? '+' : '-'}{t.montant} {currency}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
