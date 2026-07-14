import { useState } from 'react'
import { Search, Bell, MessageSquare, Building2 } from 'lucide-react'

import { useDashboardData } from "../../../use_cases/hooks/useDashboard.ts";
import { useAuth } from "../../../use_cases/hooks/useAuth.ts";
import TopStatsCards from "./TopStatsCards.tsx";
import PredictionChart from "./PredictionChart.tsx";
import WhatsAppCard from "./WhatsAppCard.tsx";
import RecentFilesCard from "./RecentFilesCard.tsx";
import RecentActivityCard from "./RecentActivityCard.tsx";
import DataQualityCard from "./DataQualityCard.tsx";
import ProfileCard from "./ProfileCard.tsx";
import Sidebar from "../../components/ui/Sidebar.tsx";

export default function DashboardPage() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { summary, topStats, recentActivity, loading } = useDashboardData()
  const { user } = useAuth()

  const hasEnterprise = !!user?.entreprise_id;
  const isAdminEnterprise = user?.account_type === 'ENTREPRISE' || user?.role === 'admin';

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

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
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
              <button className="p-2 bg-white border border-gray-100 rounded-full text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                <Bell size={15} />
              </button>
            </div>
          </header>

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