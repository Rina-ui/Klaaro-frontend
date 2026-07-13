import React, { useState } from 'react';
import { UploadCloud, Link2, Camera, AlertTriangle, FileText, BarChart3 } from 'lucide-react';
import { useUploadDashboard } from "../../../use_cases/hooks/useUploadDashboard.ts";
import NavigationTabs from "../../components/ui/NavigationTabs.tsx";
import UploadStatsSection from "./UploadStatsSection.tsx";
import UploadActionCard from "./UploadActionCard.tsx";
import AnalysisProgressCard from "./AnalysisProgressCard.tsx";
import ConnectDatabaseModal from "./ConnectDatabaseModal.tsx";
import PreprocessResultSection from "./PreprocessResultSection.tsx";

export default function UploadPage(): React.JSX.Element {
    const [isDbModalOpen, setIsDbModalOpen] = useState(false);
    // État pour gérer l'onglet local : 'import' ou 'analysis'
    const [activeSubTab, setActiveSubTab] = useState<'import' | 'analysis'>('import');

    const {
        stats,
        analysis,
        globalVolume,
        fileInputRef,
        cameraInputRef,
        handleFileSelect,
        handleStartScan,
        onFileChange,
        refreshStats,
        analysisResult,
        uploadError,
        isUploading
    } = useUploadDashboard();

    // Force le passage automatique sur l'onglet "Analyse" dès qu'un résultat arrive
    React.useEffect(() => {
        if (analysisResult) {
            setActiveSubTab('analysis');
        }
    }, [analysisResult]);

    return (
        <div className="w-full text-[#1a1a1a] font-sans p-4 md:p-8 antialiased flex flex-col items-center min-h-screen relative overflow-hidden">
            {/* Inputs natifs cachés */}
            <input type="file" ref={fileInputRef} onChange={(e) => onFileChange(e, false)} accept=".csv,.xlsx,.xls,.pdf,.json" className="hidden" />
            <input type="file" ref={cameraInputRef} onChange={(e) => onFileChange(e, true)} accept="image/*" capture="environment" className="hidden" />

            {/* Arrière-plans décoratifs */}
            <div className="absolute top-[-10%] right-[-15%] w-[750px] h-[700px] bg-[#1e5138]/15 rounded-[160px] rotate-[15deg] pointer-events-none z-0 mix-blend-multiply" />
            <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[450px] bg-[#1e5138]/30 rounded-[100px] rotate-[-10deg] pointer-events-none z-0 mix-blend-multiply" />

            <div className="w-full max-w-[1300px] flex flex-col relative z-10">
                <NavigationTabs />
                <UploadStatsSection stats={stats} globalVolume={globalVolume} />

                <header className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-gray-900">Ajoutez vos données</h2>
                        <p className="text-xs text-gray-500 mt-1 font-semibold">Choisissez la méthode adaptée pour alimenter votre tableau de bord.</p>
                    </div>

                    {/* 🛠️ LE SOUS-MENU DE NAVIGATION (Style Pilule identique à ta photo) */}
                    <div className="flex bg-gray-100/80 backdrop-blur p-1 rounded-full border border-gray-200 shadow-sm w-fit self-start sm:self-auto">
                        <button
                            onClick={() => setActiveSubTab('import')}
                            className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-full transition-all duration-200 ${
                                activeSubTab === 'import'
                                    ? 'bg-[#1e5138] text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <UploadCloud className="w-3.5 h-3.5" />
                            Importation
                        </button>
                        <button
                            onClick={() => setActiveSubTab('analysis')}
                            className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-full transition-all duration-200 relative ${
                                activeSubTab === 'analysis'
                                    ? 'bg-[#1e5138] text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <BarChart3 className="w-3.5 h-3.5" />
                            Données Analysées
                            {analysisResult && (
                                <span className="absolute top-1 right-2 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                            )}
                        </button>
                    </div>
                </header>

                {/* Gestion des erreurs globale */}
                {uploadError && (
                    <div className="w-full mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-2xl flex items-start gap-3 shadow-sm">
                        <AlertTriangle className="text-red-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-bold text-red-800">Fichier non conforme</h4>
                            <p className="text-xs text-red-700 mt-0.5 font-medium">{uploadError}</p>
                        </div>
                    </div>
                )}

                {/* AFFICHAGE CONDITIONNEL SELON L'ONGLET ACTIF */}
                {activeSubTab === 'import' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 animate-fade-in">
                        <UploadActionCard
                            title="Importer un fichier (CSV/Excel)"
                            description="Glissez vos fichiers comptables ou vos exports de vente. Klaaro supporte tous les formats standards de données d'entreprise."
                            buttonText={isUploading ? "Analyse en cours..." : "Sélectionner un fichier"}
                            icon={UploadCloud}
                            onClick={handleFileSelect}
                            isLarge={true}
                        />

                        <UploadActionCard
                            title="Connecter une source"
                            description="Synchronisation en temps réel et sécurisée avec vos comptes bancaires ou votre infrastructure ERP."
                            buttonText="Connecter"
                            icon={Link2}
                            onClick={() => setIsDbModalOpen(true)}
                        />

                        <UploadActionCard
                            title="Photographier un document"
                            description="Scannez vos reçus, notes de frais et factures papier via notre module OCR intelligent."
                            buttonText="Démarrer le scan"
                            icon={Camera}
                            onClick={handleStartScan}
                        />

                        <AnalysisProgressCard analysis={analysis} />
                    </div>
                ) : (
                    <div className="w-full mb-6 animate-fade-in">
                        {analysisResult ? (
                            <PreprocessResultSection result={analysisResult} />
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm flex flex-col items-center justify-center">
                                <FileText className="w-12 h-12 text-gray-300 mb-3" />
                                <h3 className="text-sm font-bold text-gray-700">Aucune donnée disponible</h3>
                                <p className="text-xs text-gray-400 mt-1 max-w-sm">
                                    Veuillez d'abord téléverser ou lier un fichier dans l'onglet <strong>Importation</strong> pour visualiser son analyse.
                                </p>
                                <button
                                    onClick={() => setActiveSubTab('import')}
                                    className="mt-4 px-4 py-2 bg-[#1e5138]/10 hover:bg-[#1e5138]/20 text-[#1e5138] text-xs font-bold rounded-xl transition-all"
                                >
                                    Aller à l'importation
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ConnectDatabaseModal
                isOpen={isDbModalOpen}
                onClose={() => setIsDbModalOpen(false)}
                onSuccess={refreshStats}
            />
        </div>
    );
}