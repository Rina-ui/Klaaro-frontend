// pages/DashboardPage.tsx
import { useState } from 'react'
import { Search, Bell, MessageSquare, Building2, Sliders, CheckCircle } from 'lucide-react'

import { useDashboardData } from "../../../use_cases/hooks/useDashboard.ts";
import { useAuth } from "../../../use_cases/hooks/useAuth.ts";
import { HttpVulnerabilityRepository } from "../../../infrastructure/api/HttpVulnerabilityRepository.ts";
import TopStatsCards from "./TopStatsCards.tsx";
import PredictionChart from "./PredictionChart.tsx";
import WhatsAppCard from "./WhatsAppCard.tsx";
import RecentFilesCard from "./RecentFilesCard.tsx";
import RecentActivityCard from "./RecentActivityCard.tsx";
import DataQualityCard from "./DataQualityCard.tsx";
import ProfileCard from "./ProfileCard.tsx";
import Sidebar from "../../components/ui/Sidebar.tsx";

const vulnRepo = new HttpVulnerabilityRepository();

export default function DashboardPage() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // États pour les Notifications d'Alertes & Modale
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAlerteModal, setShowAlerteModal] = useState(false);
  const [frequence, setFrequence] = useState('chaque_jour');
  const [colonneCible, setColonneCible] = useState('');
  const [savingAlert, setSavingAlert] = useState(false);
  const [alertSuccessMsg, setAlertSuccessMsg] = useState<string | null>(null);

  const { summary, topStats, recentActivity, loading } = useDashboardData()
  const { user, token } = useAuth()

  const hasEnterprise = !!user?.entreprise_id;
  const isAdminEnterprise = user?.account_type === 'ENTREPRISE' || user?.role === 'admin';

  const handleSaveAlertPreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !colonneCible.trim()) return;

    try {
      setSavingAlert(true);
      const res = await vulnRepo.updateAlertPreferences({
        alerte_frequence: frequence,
        alerte_colonne_cible: colonneCible
      }, token);

      setAlertSuccessMsg(res.alerte_immediate_generee ? "Préférences enregistrées ! Une alerte a été générée." : "Préférences d'alertes mises à jour.");
      setTimeout(() => {
        setShowAlerteModal(false);
        setAlertSuccessMsg(null);
      }, 2000);
    } catch (err: any) {
      alert(err.message || "Erreur lors de la mise à jour des préférences.");
    } finally {
      setSavingAlert(false);
    }
  };

  return (
      <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans flex p-4 md:p-6 gap-0 overflow-hidden relative items-start">

        <div className="absolute top-[-25%] right-[-15%] w-[900px] h-[600px] bg-[#1e5138]/20 rounded-[120px] rotate-[-12deg] pointer-events-none z-0 mix-blend-multiply" />
        <div className="absolute top-[-12%] right-[-5%] w-[550px] h-[450px] bg-[#1e5138]/40 rounded-[90px] rotate-[-22deg] pointer-events-none z-0 mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[-8%] w-[650px] h-[450px] bg-[#1e5138]/20 rounded-[140px] rotate-[28deg] pointer-events-none z-0 mix-blend-multiply" />

        <div className="relative z-20">
          <Sidebar
              isCollapsed={isCollapsed}
              onToggle={() => setIsCollapsed(!isCollapsed)}
          />
        </div>

        {sidebarOpen && (
            <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/20 z-40 md:hidden" />
        )}

        <main className={`flex-1 flex flex-col w-full max-w-[1600px] mx-auto relative z-10 transition-all duration-500 ease-in-out ${isCollapsed ? 'md:pl-24' : 'md:pl-28'}`}>

          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 w-full">
            <div>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden mb-2 text-sm bg-white px-3 py-1 rounded-md border border-gray-200 font-medium">Menu</button>

              <h1 className="text-xl font-bold tracking-tight">
                Hello, {user?.firstname || 'Collaborateur'} !
              </h1>

              {hasEnterprise ? (
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <Building2 size={12} className="text-emerald-700" />
                    {isAdminEnterprise ? (
                        <span>Espace Administrateur — <strong className="text-gray-800">{user?.entreprise_name || "Votre Entreprise"}</strong></span>
                    ) : (
                        <span>Membre de l'entreprise <strong className="text-gray-800">{user?.entreprise_name || "votre organisation"}</strong></span>
                    )}
                  </p>
              ) : (
                  <p className="text-xs text-gray-400 mt-0.5 italic">
                    Compte Individuel
                  </p>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end relative">
              <div className="relative w-full max-w-[200px] hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-100 rounded-full text-xs focus:outline-none focus:border-gray-300 text-gray-900"
                />
              </div>

              <button className="p-2 bg-white border border-gray-100 rounded-full text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                <MessageSquare size={15} />
              </button>

              {/* BOUTON CLOCHE NOTIFICATION / ALERTES */}
              <div className="relative">
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 bg-white border border-gray-100 rounded-full text-gray-600 hover:bg-gray-50 transition-colors shadow-sm relative cursor-pointer"
                >
                  <Bell size={15} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full" />
                </button>

                {/* DROPDOWN DE NOTIFICATION ET PRÉFÉRENCES */}
                {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 z-50 text-xs">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-3">
                        <span className="font-bold text-gray-800">Alertes & Prédictions</span>
                        <button
                            onClick={() => { setShowNotifications(false); setShowAlerteModal(true); }}
                            className="text-[10px] text-[#1e5138] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Sliders size={11} /> Configurer
                        </button>
                      </div>

                      <div className="space-y-2 max-h-56 overflow-y-auto">
                        <div className="p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-start gap-2">
                          <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-emerald-900">Prédiction d'Alertes Active</p>
                            <p className="text-[10px] text-emerald-700 mt-0.5">Vos analyses automatiques sont programmées selon vos réglages.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                )}
              </div>
            </div>
          </header>

          {/* MODALE DE CONFIGURATION DES PRÉFÉRENCES D'ALERTES */}
          {showAlerteModal && (
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm text-gray-900">Configurer mes alertes</h3>
                    <button onClick={() => setShowAlerteModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>

                  {alertSuccessMsg && (
                      <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl mb-4 font-medium">
                        {alertSuccessMsg}
                      </div>
                  )}

                  <form onSubmit={handleSaveAlertPreferences} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Fréquence d'analyse</label>
                      <select
                          value={frequence}
                          onChange={(e) => setFrequence(e.target.value)}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800"
                      >
                        <option value="chaque_jour">Chaque jour</option>
                        <option value="toutes_les_semaines">Toutes les semaines</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Colonne Cible pour Prédiction</label>
                      <input
                          type="text"
                          placeholder="ex: ventes, montant, requetes..."
                          value={colonneCible}
                          onChange={(e) => setColonneCible(e.target.value)}
                          required
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-gray-400"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                          type="button"
                          onClick={() => setShowAlerteModal(false)}
                          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-medium"
                      >
                        Annuler
                      </button>
                      <button
                          type="submit"
                          disabled={savingAlert}
                          className="px-4 py-2 bg-[#1e5138] text-white rounded-xl text-xs font-medium hover:bg-[#153a28] disabled:bg-gray-300"
                      >
                        {savingAlert ? "Enregistrement..." : "Enregistrer"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
          )}

          {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="bg-white p-3.5 rounded-xl border border-gray-100 h-[75px] animate-pulse" />
                ))}
              </div>
          ) : (
              <TopStatsCards stats={topStats} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
            <PredictionChart data={summary?.uploadsByDay ?? []} />
            <WhatsAppCard />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <RecentFilesCard />
            <RecentActivityCard activity={recentActivity} />
            <DataQualityCard />
            <ProfileCard />
          </div>
        </main>
      </div>
  )
}