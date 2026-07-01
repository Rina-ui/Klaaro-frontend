import React, { useState } from 'react';
import {
  LayoutDashboard, FileText, BarChart3, Calendar, Users, FolderHeart,
  Settings, LogOut, Search, Bell, MessageSquare, ChevronDown, MoreVertical,
  CheckCircle2, Database, UploadCloud, Cpu, type LucideIcon, Menu, MessageCircle
} from 'lucide-react';

// --- INTERFACES TYPES ---
interface StatCard { title: string; value: string; }
interface FileItem { name: string; size: string; }
interface ActivityItem { type: string; text: string; sub: string; time: string; icon: LucideIcon; color: string; }

export default function Dashboard(): React.JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const topStats: StatCard[] = [
    { title: "Fichiers uploadés", value: "48" },
    { title: "Analyses réalisées", value: "173" },
    { title: "Prédictions", value: "820" },
    { title: "Earnings", value: "$682.50" },
  ];

  const recentFiles: FileItem[] = [
    { name: "ventes_2024.csv", size: "2.4 Mo" },
    { name: "clients.xlsx", size: "1.8 Mo" },
    { name: "transactions.sql", size: "3.7 Mo" },
    { name: "marketing_data.csv", size: "5.2 Mo" },
    { name: "rapport_q2.xlsx", size: "4.1 Mo" },
  ];

  const recentActivity: ActivityItem[] = [
    { type: "analysis", text: "Analyse terminée", sub: "ventes_2024.csv", time: "5m", icon: CheckCircle2, color: "text-green-500 bg-green-50" },
    { type: "prediction", text: "Prédiction générée", sub: "Modèle XGBoost", time: "15m", icon: Cpu, color: "text-blue-500 bg-blue-50" },
    { type: "upload", text: "Fichier uploadé", sub: "marketing_data.csv", time: "1h", icon: UploadCloud, color: "text-purple-500 bg-purple-50" },
    { type: "db", text: "Connexion DB réussie", sub: "PostgreSQL", time: "2h", icon: Database, color: "text-emerald-500 bg-emerald-50" },
  ];

  return (
      <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans flex p-4 md:p-6 gap-0 overflow-x-hidden relative items-start">

        {/* 1. SIDEBAR */}
        <aside
            className={`
          fixed top-6 left-6 z-50 flex flex-col justify-between items-center bg-white border border-gray-100 shadow-sm
          transition-all duration-500 ease-in-out cursor-pointer select-none
          ${isCollapsed
                ? 'w-16 h-16 rounded-full py-0 justify-center hover:bg-gray-50'
                : 'w-20 h-[calc(100vh-48px)] rounded-[40px] py-8'
            }
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
            onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
              <div className="text-gray-800 transition-transform duration-300 transform scale-110">
                <Menu size={24} />
              </div>
          ) : (
              <>
                <div className="flex flex-col items-center gap-6 w-full" onClick={(e) => e.stopPropagation()}>
                  <button className="p-4 bg-[#1a1a1a] text-white rounded-full shadow-md transition-transform active:scale-95">
                    <LayoutDashboard size={20} />
                  </button>
                  <button className="p-3 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors"><FileText size={20} /></button>
                  <button className="p-3 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors"><BarChart3 size={20} /></button>
                  <button className="p-3 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors"><Calendar size={20} /></button>
                  <button className="p-3 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors"><Users size={20} /></button>
                  <button className="p-3 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors"><FolderHeart size={20} /></button>
                </div>

                <div className="flex flex-col items-center gap-5 w-full" onClick={(e) => e.stopPropagation()}>
                  <button className="p-3 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors"><Settings size={20} /></button>
                  <button className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><LogOut size={20} /></button>
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm mt-2">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Marina profile" className="w-full h-full object-cover" />
                  </div>
                </div>
              </>
          )}
        </aside>

        {/* Overlay Mobile */}
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/20 z-40 md:hidden" />}

        {/* 2. AREA CONTENU */}
        <main className={`flex-1 flex flex-col w-full max-w-[1600px] mx-auto transition-all duration-500 ease-in-out ${isCollapsed ? 'md:pl-24' : 'md:pl-28'}`}>

          {/* HEADER */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <div>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden mb-2 text-sm bg-white px-3 py-1 rounded-md border border-gray-200 font-medium">Menu</button>
              <h1 className="text-xl font-bold tracking-tight">Hello, Marina!</h1>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="relative w-full max-w-xs hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input type="text" placeholder="Rechercher..." className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-100 rounded-full text-xs focus:outline-none focus:border-gray-300" />
              </div>
              <button className="p-2 bg-white border border-gray-100 rounded-full text-gray-600 relative hover:bg-gray-50">
                <MessageSquare size={15} />
              </button>
              <button className="p-2 bg-white border border-gray-100 rounded-full text-gray-600 hover:bg-gray-50"><Bell size={15} /></button>
            </div>
          </header>

          {/* STATS HAUT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
            {topStats.map((stat, i) => (
                <div key={i} className="bg-white p-3.5 rounded-xl border border-gray-100 flex flex-col justify-center min-h-[75px]">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-lg font-bold mt-0.5">{stat.value}</h3>
                </div>
            ))}
            <div className="bg-[#1e5138] text-white p-3.5 rounded-xl flex flex-col justify-center min-h-[75px] lg:col-span-1 sm:col-span-2">
              <p className="text-[10px] font-semibold opacity-70 uppercase tracking-wider">Accuracy moyenne</p>
              <h3 className="text-lg font-bold mt-0.5">97,4%</h3>
            </div>
          </div>

          {/* MIDDLE SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">

            {/* ÉVOLUTION DES PRÉDICTIONS */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 lg:col-span-2 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Évolution des prédictions</h3>
                <button className="text-[10px] border border-gray-100 px-2 py-0.5 rounded bg-white"><ChevronDown size={10} /></button>
              </div>
              <div className="h-28 w-full flex items-end relative">
                <svg className="w-full h-full stroke-emerald-600 fill-emerald-50/10" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path d="M0,25 Q15,15 25,22 T50,12 T75,18 T100,5 L100,30 L0,30 Z" strokeWidth="0.5" />
                  <path d="M0,25 Q15,15 25,22 T50,12 T75,18 T100,5" strokeWidth="1" fill="none" />
                </svg>
              </div>
            </div>

            {/* LA CARD WHATSAPP METAMORPHOSÉE EN VERTE */}
            <div className="bg-[#e8f5e9] p-5 rounded-xl border border-[#c8e6c9] flex flex-col justify-between items-center text-center shadow-sm">
              <div className="flex flex-col items-center mt-2">
                <div className="w-12 h-12 bg-white text-[#25D366] rounded-full flex items-center justify-center mb-3 shadow-sm">
                  <MessageCircle size={24} fill="currentColor" />
                </div>
                <h3 className="font-bold text-sm tracking-wide text-[#1b5e20]">Alertes WhatsApp</h3>
                <p className="text-[11px] text-[#2e7d32] mt-1.5 max-w-[210px] leading-relaxed font-medium">
                  Connectez votre compte pour recevoir vos notifications et rapports d'analyses directement sur votre messagerie.
                </p>
              </div>

              <button className="w-full bg-[#25D366] hover:bg-[#20ba56] text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] mt-4">
                Connecter WhatsApp
              </button>
            </div>

          </div>

          {/* CARDS DU BAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* CARTE 1: FICHIERS RÉCENTS TOTALEMENT NETTOYÉE */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col h-[250px]">
              <div className="flex justify-between items-center mb-3 shrink-0">
                <h3 className="font-bold text-[11px] uppercase tracking-wide text-gray-400">Fichiers récents</h3>
                <a href="#" className="text-[10px] text-gray-400 hover:underline">Voir tout</a>
              </div>
              <div className="flex-1 overflow-y-auto pr-0.5 space-y-1 scrollbar-thin">
                {recentFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0 hover:bg-gray-50/60 px-2 rounded transition-colors">
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-semibold text-gray-800 truncate max-w-[170px]">{file.name}</h4>
                        <p className="text-[9px] text-gray-400 mt-0.5">{file.size}</p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={14} /></button>
                    </div>
                ))}
              </div>
            </div>

            {/* CARTE 2: ACTIVITÉ RÉCENTE */}
            <div className="bg-white p-3.5 rounded-xl border border-gray-100 h-[250px] flex flex-col">
              <h3 className="font-bold text-[11px] uppercase tracking-wide text-gray-400 mb-2 shrink-0">Activité récente</h3>
              <div className="flex-1 overflow-y-auto space-y-2.5 relative before:absolute before:left-2.5 before:top-1 before:bottom-1 before:w-[1px] before:bg-gray-100 pr-0.5">
                {recentActivity.map((act, i) => {
                  const IconComp = act.icon;
                  return (
                      <div key={i} className="flex gap-2 relative items-start text-[10px]">
                        <div className={`p-1 rounded-full z-10 shrink-0 ${act.color}`}>
                          <IconComp size={10} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-700 truncate">{act.text}</h4>
                          <p className="text-[9px] text-gray-400 truncate">{act.sub}</p>
                        </div>
                        <span className="text-[8px] text-gray-400 shrink-0">{act.time}</span>
                      </div>
                  );
                })}
              </div>
            </div>

            {/* CARTE 3: QUALITÉ DES DONNÉES */}
            <div className="bg-white p-3.5 rounded-xl border border-gray-100 h-[250px] flex flex-col justify-between items-center">
              <h3 className="font-bold text-[11px] uppercase tracking-wide text-gray-400 w-full text-left">Qualité des données</h3>
              <div className="relative w-20 h-20 flex items-center justify-center my-1">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-gray-100" strokeWidth="3.5" stroke="currentColor" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-emerald-500" strokeWidth="3.5" strokeDasharray="92, 100" strokeLinecap="round" stroke="currentColor" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-base font-bold block leading-none">92%</span>
                  <span className="text-[8px] text-gray-400 mt-0.5 block">Très bonne</span>
                </div>
              </div>
              <div className="flex gap-3 text-[9px] text-gray-400 font-medium border-t border-gray-50 pt-2 w-full justify-center">
                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Complètes</div>
                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Manquantes</div>
              </div>
            </div>

            {/* CARTE 4: PROFIL */}
            <div className="bg-white p-3.5 rounded-xl border border-gray-100 h-[250px] flex flex-col items-center text-center justify-between">
              <div className="flex flex-col items-center w-full mt-1">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marina" alt="Avatar" className="w-12 h-12 bg-amber-100 rounded-full border p-0.5 mb-1.5" />
                <h3 className="font-bold text-xs">Marina K.</h3>
                <p className="text-[10px] text-gray-400">marina@gmail.com</p>
                <span className="mt-1.5 text-[8px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Premium
              </span>
              </div>
              <div className="grid grid-cols-3 gap-1 w-full border-t border-gray-100 pt-2.5 text-center">
                <div><span className="text-[9px] text-gray-400 block">Projets</span><span className="font-bold text-xs">12</span></div>
                <div><span className="text-[9px] text-gray-400 block">Analyses</span><span className="font-bold text-xs">173</span></div>
                <div><span className="text-[9px] text-gray-400 block">Preds</span><span className="font-bold text-xs">820</span></div>
              </div>
            </div>

          </div>

        </main>
      </div>
  );
}