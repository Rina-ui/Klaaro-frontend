import React from 'react';
import {
    UploadCloud, Link2, Camera, CheckCircle2,
    ArrowRight, RefreshCw, Calendar, FileText,
    Database, Image as ImageIcon, Layers
} from 'lucide-react';

export default function UploadPage(): React.JSX.Element {
    return (
        <div className="min-h-screen bg-[#e2e4e3] text-[#1a1a1a] font-sans p-4 md:p-8 antialiased flex flex-col items-center">

            {/* CONTENEUR PRINCIPAL SANS SIDEBAR */}
            <div className="w-full max-w-[1300px] flex flex-col">

                {/* BARRE DE NAVIGATION STYLE GÉLULE (SANS TEAM) */}
                <div className="flex justify-between items-center mb-10 w-full">
                    <div className="bg-[#f1f3f2] border border-gray-200/40 px-4 py-2 rounded-2xl text-xs font-semibold text-gray-600 flex items-center gap-2 shadow-sm">
                        <Calendar size={14} className="text-[#1e5138]" />
                        <span>Jan 6</span>
                    </div>

                    <div className="flex items-center gap-1 bg-[#f1f3f2] border border-gray-200/40 p-1 rounded-full text-xs font-semibold text-gray-400 shadow-sm">
                        <button className="px-5 py-2 rounded-full text-gray-600 hover:text-gray-900 transition-colors">Dashboard</button>
                        <button className="bg-[#1e5138] text-white px-5 py-2 rounded-full shadow-sm">Uploads</button>
                    </div>
                </div>

                {/* SECTION STATISTIQUES : BLOC COMPACT + BIG SPACE + BLOC VERT DROITE */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 items-start">

                    {/* Les 3 cartes blanches regroupées de manière serrée (8 colonnes sur 12) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:col-span-8">

                        {/* Fichiers Uploadés */}
                        <div className="bg-[#f1f3f2] p-6 rounded-[28px] border border-gray-200/30 shadow-sm flex flex-col justify-between min-h-[140px]">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-bold text-gray-400 tracking-wide">Fichiers uploadés</span>
                                <span className="text-[10px] font-bold bg-emerald-100/60 text-emerald-800 px-2 py-0.5 rounded-full">+4</span>
                            </div>
                            <div className="flex items-end justify-between mt-4">
                                <div className="p-3 bg-gray-200/60 rounded-2xl text-gray-500">
                                    <FileText size={20} />
                                </div>
                                <span className="text-4xl font-black tracking-tight text-gray-900">35</span>
                            </div>
                        </div>

                        {/* Connexions BD */}
                        <div className="bg-[#f1f3f2] p-6 rounded-[28px] border border-gray-200/30 shadow-sm flex flex-col justify-between min-h-[140px]">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-bold text-gray-400 tracking-wide">Connexions BD</span>
                            </div>
                            <div className="flex items-end justify-between mt-4">
                                <div className="p-3 bg-gray-200/60 rounded-2xl text-gray-500">
                                    <Database size={20} />
                                </div>
                                <span className="text-4xl font-black tracking-tight text-gray-900">12</span>
                            </div>
                        </div>

                        {/* Photos Scannées */}
                        <div className="bg-[#f1f3f2] p-6 rounded-[28px] border border-gray-200/30 shadow-sm flex flex-col justify-between min-h-[140px]">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-bold text-gray-400 tracking-wide">Photos scannées</span>
                            </div>
                            <div className="flex items-end justify-between mt-4">
                                <div className="p-3 bg-gray-200/60 rounded-2xl text-gray-500">
                                    <ImageIcon size={20} />
                                </div>
                                <span className="text-4xl font-black tracking-tight text-gray-900">16<span className="text-sm font-bold text-gray-400">/20</span></span>
                            </div>
                        </div>

                    </div>

                    {/* LE BIG SPACE VOLONTAIRE : Le bloc vert commence à la colonne 10, laissant la colonne 9 vide */}
                    <div className="lg:col-start-10 lg:col-span-3 bg-[#1e5138] p-6 rounded-[28px] text-white shadow-md flex flex-col justify-between min-h-[140px] w-full">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-emerald-200/70 tracking-wide">Volume global traité</span>
                            <span className="text-[10px] font-bold bg-white/10 text-white px-2.5 py-0.5 rounded-full">Ce mois</span>
                        </div>

                        <div className="flex items-end justify-between mt-4">
                            <div>
                                <span className="text-5xl font-black tracking-tight">63</span>
                                <span className="text-[11px] block text-emerald-100/60 font-semibold mt-1">Documents & sources</span>
                            </div>
                            <div className="p-3 bg-white/10 rounded-2xl text-white">
                                <Layers size={22} />
                            </div>
                        </div>
                    </div>

                </div>

                {/* TITRE PRINCIPAL DE LA ZONE D'ACTION */}
                <header className="mb-6">
                    <h2 className="text-3xl font-black tracking-tight text-gray-900">Ajoutez vos données</h2>
                    <p className="text-xs text-gray-500 mt-1 font-semibold">
                        Choisissez la méthode adaptée pour alimenter votre tableau de bord.
                    </p>
                </header>

                {/* GRILLE DES ACTIONS COMPLÈTE (FICHIERS, BD, PHOTOS, ET ANALYSE) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                    {/* ACTION 1 : IMPORTER UN FICHIER */}
                    <div className="bg-[#f1f3f2] p-6 rounded-[32px] border border-gray-200/20 flex flex-col justify-between min-h-[220px] lg:col-span-2 shadow-sm group hover:border-emerald-200/50 transition-all">
                        <div>
                            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                                <UploadCloud size={20} className="text-[#1e5138]" />
                            </div>
                            <h3 className="font-bold text-sm text-gray-900 tracking-wide">Importer un fichier (CSV/Excel)</h3>
                            <p className="text-xs text-gray-400 mt-2 max-w-lg leading-relaxed font-medium">
                                Glissez vos fichiers comptables ou vos exports de vente. Klaaro supporte tous les formats standards de données d'entreprise.
                            </p>
                        </div>
                        <button className="flex items-center gap-2 text-xs font-bold text-[#1e5138] w-max mt-4 group">
                            Sélectionner un fichier
                            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>

                    {/* ACTION 2 : CONNECTER UNE SOURCE BANQUE/ERP */}
                    <div className="bg-[#f1f3f2] p-6 rounded-[32px] border border-gray-200/20 flex flex-col justify-between min-h-[220px] shadow-sm group hover:border-emerald-200/50 transition-all">
                        <div>
                            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                                <Link2 size={20} className="text-[#1e5138]" />
                            </div>
                            <h3 className="font-bold text-sm text-gray-900 tracking-wide">Connecter une source</h3>
                            <p className="text-xs text-gray-400 mt-2 leading-relaxed font-medium">
                                Synchronisation en temps réel et sécurisée avec vos comptes bancaires ou votre infrastructure ERP.
                            </p>
                        </div>
                        <button className="flex items-center gap-2 text-xs font-bold text-[#1e5138] w-max mt-4">
                            Connecter <Link2 size={13} />
                        </button>
                    </div>

                    {/* ACTION 3 : PHOTOGRAPHIER UN DOCUMENT */}
                    <div className="bg-[#f1f3f2] p-6 rounded-[32px] border border-gray-200/20 flex flex-col justify-between min-h-[220px] shadow-sm group hover:border-emerald-200/50 transition-all">
                        <div>
                            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                                <Camera size={19} className="text-[#1e5138]" />
                            </div>
                            <h3 className="font-bold text-sm text-gray-900 tracking-wide">Photographier un document</h3>
                            <p className="text-xs text-gray-400 mt-2 leading-relaxed font-medium">
                                Scannez vos reçus, notes de frais et factures papier via notre module OCR intelligent.
                            </p>
                        </div>
                        <button className="flex items-center gap-2 text-xs font-bold text-[#1e5138] w-max mt-4">
                            Démarrer le scan <Camera size={13} />
                        </button>
                    </div>

                    {/* ACTION 4 : SUIVI DE L'ANALYSE EN COURS */}
                    <div className="bg-[#f1f3f2] p-6 rounded-[32px] border border-gray-200/20 shadow-sm lg:col-span-2 flex flex-col justify-between min-h-[220px]">
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <h3 className="font-bold text-sm text-gray-900 tracking-wide">Analyse en cours...</h3>
                                </div>
                                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">74%</span>
                            </div>
                            <p className="text-xs text-gray-400 font-medium mb-4">Facture_A2402_Client_X.pdf • 1.2 MB</p>

                            {/* Barre de chargement assortie */}
                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-5">
                                <div className="bg-[#1e5138] h-full w-[74%] rounded-full transition-all duration-700" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium border-t border-gray-200/30 pt-3.5">
                                <div className="flex items-center gap-2 text-gray-800">
                                    <CheckCircle2 size={14} className="text-emerald-600" />
                                    <span>OCR terminé</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-800">
                                    <CheckCircle2 size={14} className="text-emerald-600" />
                                    <span>Catégorisation</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <RefreshCw size={13} className="animate-spin text-emerald-600" />
                                    <span>Impact fiscal</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}