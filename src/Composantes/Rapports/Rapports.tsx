import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { RefreshCw, ArrowUpCircle, LayoutDashboard, TrendingUp, AlertTriangle, Download } from 'lucide-react';
import { Header } from '../Communs/Header';
import { Card } from '../Communs/Card';
import { RapportMensuel } from './RapportMensuel';
import { RapportAnnuel } from './RapportAnnuel';
import { useCurrency } from '../../Context/CurrencyContext';
import { useTheme } from '../../Context/ThemeContext';
import { getService } from '../../Services/serviceFactory';
import { ReportData } from '../../types';

/**
 * Page de rapports et analyses financières
 */
export const Rapports = () => {
  const [donnees, setDonnees] = useState<ReportData | null>(null);
  const [chargement, setChargement] = useState(true);
  const [periode, setPeriode] = useState<'week' | 'month' | 'year'>('month');
  const [dateRef, setDateRef] = useState(new Date());
  const [typeCamembert, setTypeCamembert] = useState<'depense' | 'revenu'>('depense');
  const [categorieSelectionnee, setCategorieSelectionnee] = useState<any>(null);
  const { currency } = useCurrency();
  const { isDark } = useTheme();

  const recupererRapports = async () => {
    setChargement(true);
    try {
      const resume = await getService().obtenirResumeRapports(periode, dateRef);
      setDonnees(resume);
    } catch (err) {
      console.error(err);
    } finally {
      setChargement(false);
    }
  };

  const naviguerPeriode = (direction: 'prev' | 'next') => {
    const nouvelleDate = new Date(dateRef);
    if (periode === 'week') {
      nouvelleDate.setDate(dateRef.getDate() + (direction === 'next' ? 7 : -7));
    } else if (periode === 'month') {
      nouvelleDate.setMonth(dateRef.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (periode === 'year') {
      nouvelleDate.setFullYear(dateRef.getFullYear() + (direction === 'next' ? 1 : -1));
    }
    setDateRef(nouvelleDate);
  };

  const exporterDonnees = () => {
    if (!donnees) return;
    let csv = "Categorie,Type,Montant,Pourcentage\n";
    
    donnees.categoryDistribution.forEach((item: any) => {
      const total = donnees.categoryDistribution.reduce((acc: number, i: any) => acc + i.value, 0);
      const pCent = total > 0 ? Math.round((item.value / total) * 100) : 0;
      csv += `${item.name},Depense,${item.value},${pCent}%\n`;
    });
    
    donnees.incomeCategoryDistribution.forEach((item: any) => {
      const totalRev = donnees.incomeCategoryDistribution.reduce((acc: number, i: any) => acc + i.value, 0);
      const pCent = totalRev > 0 ? Math.round((item.value / totalRev) * 100) : 0;
      csv += `${item.name},Revenu,${item.value},${pCent}%\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `rapport_optima_${periode}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const gererNavigation = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'export') {
      exporterDonnees();
    }
  };

  useEffect(() => {
    recupererRapports();
  }, [periode, dateRef]);

  if (chargement || !donnees) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <RefreshCw className="animate-spin text-brand-purple" size={32} />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <Header title="Rapports" subtitle="Analyses et Statistiques" />

      <div className="px-6 space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-1 space-y-6">
            {/* Filtre de Periode */}
            <div className="space-y-3">
              <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                {['week', 'month', 'year'].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPeriode(p as any);
                      setDateRef(new Date());
                    }}
                    className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
                      periode === p 
                        ? 'bg-brand-purple dark:bg-brand-cyan text-white dark:text-slate-900 shadow-md shadow-brand-purple/20 dark:shadow-brand-cyan/20' 
                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Annee'}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <button 
                  onClick={() => naviguerPeriode('prev')}
                  className="p-2 text-slate-400 hover:text-brand-purple dark:hover:text-brand-cyan transition-colors"
                >
                  <ArrowUpCircle className="-rotate-90" size={20} />
                </button>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {donnees?.summary.periodName || 'Chargement...'}
                </span>
                <button 
                  onClick={() => naviguerPeriode('next')}
                  className="p-2 text-slate-400 hover:text-brand-purple dark:hover:text-brand-cyan transition-colors"
                >
                  <ArrowUpCircle className="rotate-90" size={20} />
                </button>
              </div>
            </div>

            {/* Totaux de la Periode */}
            <div id="overview" className="grid grid-cols-2 gap-4">
              <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800">
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Revenus</p>
                <p className="text-xl font-black text-emerald-700 dark:text-emerald-300">+{donnees.summary.income.toLocaleString('fr-FR')} {currency}</p>
              </Card>
              <Card className="bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800">
                <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">Depenses</p>
                <p className="text-xl font-black text-rose-700 dark:text-rose-300">-{donnees.summary.expenses.toLocaleString('fr-FR')} {currency}</p>
              </Card>
            </div>

            <Card className="bg-brand-purple/5 dark:bg-brand-purple/10 border-brand-purple/10 dark:border-brand-purple/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-brand-purple dark:text-brand-cyan uppercase tracking-wider mb-1">Solde de la periode</p>
                  <p className={`text-2xl font-black ${donnees.summary.balance >= 0 ? 'text-brand-purple dark:text-brand-cyan' : 'text-rose-600 dark:text-rose-400'}`}>
                    {donnees.summary.balance.toLocaleString('fr-FR')} {currency}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Moyenne / Jour</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{Math.round(donnees.summary.avgDaily).toLocaleString('fr-FR')} {currency}</p>
                </div>
              </div>
            </Card>

            {/* Navigation Rapide */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-2">
              {[
                { id: 'overview', icon: LayoutDashboard, label: 'Vue d\'ensemble' },
                { id: 'trends', icon: TrendingUp, label: 'Tendances' },
                { id: 'alerts', icon: AlertTriangle, label: 'Alertes' },
                { id: 'export', icon: Download, label: 'Export' },
              ].map(item => (
                <button 
                  key={item.id} 
                  onClick={() => gererNavigation(item.id)}
                  className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm active:scale-95 transition-transform"
                >
                  <div className="text-brand-purple dark:text-brand-cyan"><item.icon size={20} /></div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{item.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            {periode === 'year' ? (
              <RapportAnnuel donnees={donnees} isDark={isDark} currency={currency} />
            ) : (
              <RapportMensuel 
                donnees={donnees} 
                isDark={isDark} 
                currency={currency} 
                typeCamembert={typeCamembert} 
                setTypeCamembert={setTypeCamembert} 
                setCategorieSelectionnee={setCategorieSelectionnee} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
