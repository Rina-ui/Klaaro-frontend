import React from 'react';
import {
    Calendar, ArrowUpRight, BarChart3, TrendingUp,
    Plus, ChevronRight
} from 'lucide-react';

export default function PredictionsPage(): React.JSX.Element {
    return (
        <div className="min-h-screen bg-[#e2e4e3] text-[#1a1a1a] font-sans p-4 md:p-8 antialiased flex flex-col items-center">

            {/* CONTENEUR PRINCIPAL */}
            <div className="w-full max-w-[1300px] flex flex-col">

                {/* BARRE DE NAVIGATION GÉLULE */}
                <div className="flex justify-between items-center mb-8 w-full">
                    <div className="bg-[#f1f3f2] border border-gray-200/40 px-4 py-2 rounded-2xl text-xs font-semibold text-gray-600 flex items-center gap-2 shadow-sm">
                        <Calendar size={14} className="text-[#1e5138]" />
                        <span>Jan 6</span>
                    </div>

                    <div className="flex items-center gap-1 bg-[#f1f3f2] border border-gray-200/40 p-1 rounded-full text-xs font-semibold text-gray-400 shadow-sm">
                        <button className="px-5 py-2 rounded-full text-gray-600 hover:text-gray-900 transition-colors">Dashboard</button>
                        <button className="px-5 py-2 rounded-full text-gray-600 hover:text-gray-900 transition-colors">Uploads</button>
                        <button className="bg-[#1e5138] text-white px-5 py-2 rounded-full shadow-sm">Predictions</button>
                    </div>
                </div>

                {/* TOP ROW : GÉLULES + CHIFFRES REVENUS (SANS LES PETITS TRUCS +12%) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-center w-full">

                    {/* LES GÉLULES DE PROGRESSION */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-6">

                        {/* Overview */}
                        <div className="cursor-pointer group">
              <span className="text-[11px] font-bold text-gray-500 block mb-1.5 flex items-center gap-1 group-hover:text-gray-900 transition-colors">
                <BarChart3 size={12} className="text-[#1e5138]" /> Overview
              </span>
                            <div className="w-full bg-[#d8dbd8] h-7 rounded-full overflow-hidden p-0.5 shadow-inner transition-all group-hover:ring-1 group-hover:ring-[#1e5138]/20">
                                <div className="bg-[#1e5138] h-full w-[75%] rounded-full flex items-center justify-between px-3 shadow-sm">
                                    <span className="text-[10px] font-black text-white">75%</span>
                                    <ChevronRight size={10} className="text-white opacity-80" />
                                </div>
                            </div>
                        </div>

                        {/* Croissance */}
                        <div className="cursor-pointer group">
              <span className="text-[11px] font-bold text-gray-400 block mb-1.5 flex items-center gap-1 group-hover:text-gray-900 transition-colors">
                <TrendingUp size={12} /> Croissance
              </span>
                            <div className="w-full bg-[#d8dbd8] h-7 rounded-full overflow-hidden p-0.5 shadow-inner">
                                <div className="bg-white h-full w-[40%] rounded-full flex items-center pl-3 shadow-sm">
                                    <span className="text-[10px] font-black text-gray-700">40%</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* COMPTEURS CHIFFRÉS REPLUGUÉS (MAIS SANS LES PETITES PASTILLES VERTES/ROUGES DE POURCENTAGE) */}
                    <div className="lg:col-start-9 lg:col-span-4 flex justify-between items-center gap-4">
                        <div className="text-right">
                            <span className="text-2xl font-black text-gray-900 tracking-tight">38</span>
                            <span className="text-[10px] font-bold text-gray-400 block mt-0.5">Critical issues</span>
                        </div>

                        <div className="text-right">
                            <span className="text-2xl font-black text-gray-900 tracking-tight">26</span>
                            <span className="text-[10px] font-bold text-gray-400 block mt-0.5">Days spent</span>
                        </div>

                        <div className="text-right">
                            <span className="text-2xl font-black text-gray-900 tracking-tight">103</span>
                            <span className="text-[10px] font-bold text-gray-400 block mt-0.5">Overnight work</span>
                        </div>
                    </div>

                </div>

                {/* COEUR DE LA PAGE : GRAPHIQUE + BLOC VERT INSIGHT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6 w-full">

                    {/* ZONE GRAPHIQUE CHIFFRE D'AFFAIRES */}
                    <div className="bg-[#f1f3f2] p-6 rounded-[32px] border border-gray-200/20 shadow-sm lg:col-span-8 flex flex-col justify-between min-h-[350px]">
                        <div>
                            <div className="flex justify-between items-start mb-1">
                                <div>
                                    <h3 className="font-bold text-sm text-gray-900 tracking-wide">Prévisions</h3>
                                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5"> • Mise à jour il y a 2h</p>
                                </div>

                                <div className="flex bg-gray-200/80 p-0.5 rounded-xl text-[10px] font-bold text-gray-400 shadow-inner">
                                    <span className="px-2.5 py-1 cursor-pointer hover:text-gray-700">Optimiste</span>
                                    <span className="bg-white text-[#1e5138] px-3 py-1 rounded-lg shadow-sm">Réaliste</span>
                                    <span className="px-2.5 py-1 cursor-pointer hover:text-gray-700">Pessimiste</span>
                                </div>
                            </div>

                            {/* Courbe vectorielle verte */}
                            <div className="relative w-full h-44 mt-8 flex items-end">
                                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="chart-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#1e5138" stopOpacity="0.12" />
                                            <stop offset="100%" stopColor="#1e5138" stopOpacity="0.0" />
                                        </linearGradient>
                                    </defs>
                                    <line x1="200" y1="0" x2="200" y2="120" stroke="#1e5138" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />

                                    <rect x="25" y="70" width="12" height="50" rx="3" fill="#e2e4e3" />
                                    <rect x="75" y="60" width="12" height="60" rx="3" fill="#e2e4e3" />
                                    <rect x="125" y="80" width="12" height="40" rx="3" fill="#e2e4e3" />
                                    <rect x="175" y="50" width="12" height="70" rx="3" fill="#e2e4e3" />

                                    <path d="M 187 60 Q 230 45, 280 55 T 380 20" fill="none" stroke="#1e5138" strokeWidth="2.5" strokeLinecap="round" />
                                    <path d="M 187 60 Q 230 45, 280 55 T 380 20 L 380 120 L 187 120 Z" fill="url(#chart-grad)" />

                                    <circle cx="187" cy="60" r="4.5" fill="#1e5138" stroke="white" strokeWidth="2.5" />
                                </svg>

                                <div className="absolute top-[28px] left-[148px] bg-[#1e5138] text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                                    Aujourd'hui
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 mt-3 px-1">
                                <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span className="text-[#1e5138] font-black">Mai</span><span>Juin</span><span>Juil</span><span>Août</span>
                            </div>
                        </div>
                    </div>

                    {/* INSIGHT IA VERT */}
                    <div className="lg:col-start-10 lg:col-span-3 flex flex-col justify-between bg-[#1e5138] p-6 rounded-[32px] text-white shadow-md min-h-[350px]">
                        <div>
              <span className="text-xs font-bold text-emerald-200/70 tracking-wide flex items-center gap-1.5 mb-6">
                <ArrowUpRight size={14} /> Insight IA
              </span>
                            <p className="text-xs font-medium leading-relaxed text-emerald-50/90">
                                "Vos revenus devraient augmenter de <span className="bg-emerald-500/40 text-emerald-200 px-1.5 py-0.5 rounded-md font-bold">12%</span> le mois prochain grâce à la <span className="underline underline-offset-4 decoration-emerald-400/40 font-semibold">forte demande saisonnière</span> en produits frais."
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button className="w-full bg-white text-gray-900 hover:bg-gray-50 transition-all text-[11px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5">
                                <Plus size={13} className="text-[#1e5138]" />
                                <span>Nouvelle Simulation</span>
                            </button>
                            <button className="w-full bg-white/10 hover:bg-white/15 transition-all text-white text-[11px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5">
                                <span>Voir les détails</span>
                                <ArrowUpRight size={13} />
                            </button>
                        </div>
                    </div>

                </div>

                {/* 3 PETITES CARTES DE SYNTHÈSE DU BAS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                    <div className="bg-[#f1f3f2] p-5 rounded-[24px] border border-gray-200/30 shadow-sm flex flex-col justify-between min-h-[110px]">
                        <span className="text-[11px] font-bold text-gray-400 tracking-wide">Cash flow prévu (30j)</span>
                        <span className="text-2xl font-black tracking-tight text-gray-900 mt-2">2.4M <span className="text-xs font-bold text-gray-400">FCFA</span></span>
                    </div>

                    <div className="bg-[#f1f3f2] p-5 rounded-[24px] border border-gray-200/30 shadow-sm flex flex-col justify-between min-h-[110px]">
                        <span className="text-[11px] font-bold text-gray-400 tracking-wide">Commandes prévues</span>
                        <span className="text-3xl font-black tracking-tight text-gray-900 mt-2">842</span>
                    </div>

                    <div className="bg-[#f1f3f2] p-5 rounded-[24px] border border-gray-200/30 shadow-sm flex flex-col justify-between min-h-[110px]">
                        <span className="text-[11px] font-bold text-gray-400 tracking-wide">Seuil de rentabilité</span>
                        <span className="text-2xl font-black tracking-tight text-gray-900 mt-2">18 Mai</span>
                    </div>
                </div>

            </div>
        </div>
    );
}