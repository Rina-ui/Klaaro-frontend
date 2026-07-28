import React, { useState, useEffect } from 'react';
import { UploadCloud, Link2, Camera, AlertTriangle, FileText, BarChart3, Clock } from 'lucide-react';
import { useUploadDashboard } from "../../../use_cases/hooks/useUploadDashboard.ts";
import { useRapportHistory, type RapportEntity } from "../../../use_cases/hooks/useRapportHistory.ts";
import { formatRelativeDate } from "../../../use_cases/utils/formatRelativeDate.ts";
import RapportHistorySelect from "../../components/shared/RapportHistorySelect.tsx";
import NavigationTabs from "../../components/ui/NavigationTabs.tsx";
import UploadStatsSection from "./UploadStatsSection.tsx";
import UploadActionCard from "./UploadActionCard.tsx";
import AnalysisProgressCard from "./AnalysisProgressCard.tsx";
import ConnectDatabaseModal from "./ConnectDatabaseModal.tsx";
import PreprocessResultSection from "./PreprocessResultSection.tsx";
import KlaaroChatDrawer from "../../components/shared/KlaaroChatDrawer.tsx";
import AnalysisResultCard from "../../components/shared/AnalysisResultCard.tsx";

export default function UploadPage(): React.JSX.Element {
    const [isDbModalOpen, setIsDbModalOpen] = React.useState(false);

    // ✅ État React pur (Remplacement de useLocalStorageState)
    const [activeSubTab, setActiveSubTab] = useState<'import' | 'analysis'>('import');

    // État pour conserver le dernier fichier binaire sélectionné par l'utilisateur
    const [lastUploadedFile, setLastUploadedFile] = useState<File | null>(null);

    const {
        stats,
        analysis,
        globalVolume,
        fileInputRef,
        cameraInputRef,
        handleFileSelect,
        handleStartScan,
        onFileChange: originalOnFileChange,
        refreshStats,
        analysisResult,
        loadRapport,
        recentDocuments = [],
        uploadError,
        isUploading
    } = useUploadDashboard();

    const { history, loading: historyLoading, refresh: refreshHistory } = useRapportHistory('preprocessing');
    const [selectedRapportId, setSelectedRapportId] = useState<string | null>(null);

    // Wrapper pour intercepter le fichier sélectionné et le stocker avant le traitement
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, isCamera: boolean = false) => {
        if (e.target.files && e.target.files[0]) {
            setLastUploadedFile(e.target.files[0]);
        }
        originalOnFileChange(e, isCamera);
    };

    // Casting explicite pour isoler les accès aux clés dynamiques
    const rawResult = analysisResult as unknown as Record<string, unknown> | null;
    const rapportObj = rawResult?.rapport as Record<string, unknown> | undefined;
    const statsObj = rawResult?.stats as Record<string, number> | undefined;
    const chartDataArray = rawResult?.chart_data as Array<{ name: string; valeur: unknown }> | undefined;

    useEffect(() => {
        if (analysisResult) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveSubTab('analysis');
            refreshHistory();
            const rapportId = (rapportObj?.id as string) || (rawResult?.id as string);
            if (rapportId) {
                setSelectedRapportId(rapportId);
            }
        }
    }, [analysisResult, refreshHistory]);

    const chartDataForKlaaro = chartDataArray?.map((point) => ({
        date: point.name,
        Historique: typeof point.valeur === 'number' ? point.valeur : null,
        Prevision: null
    })) || null;

    const extractedFileName = lastUploadedFile?.name || (rawResult?.filename as string) || (rapportObj?.filename as string) || "Document_analyse.csv";
    const extractedExplications = (rawResult?.explications as string) ||
        (rapportObj?.summary as string) ||
        "L'analyse et le nettoyage des données ont été exécutés avec succès.";

    return (
        <div className="w-full text-[#1a1a1a] font-sans p-4 md:p-8 antialiased flex flex-col items-center min-h-screen relative overflow-hidden">
            <input type="file" ref={fileInputRef} onChange={(e) => onFileChange(e, false)} accept=".csv,.xlsx,.xls,.pdf,.json" className="hidden" />
            <input type="file" ref={cameraInputRef} onChange={(e) => onFileChange(e, true)} accept="image/*" capture="environment" className="hidden" />

            <div className="absolute top-[-10%] right-[-15%] w-187.5 h-175 bg-[#1e5138]/15 rounded-[160px] rotate-[15deg] pointer-events-none z-0 mix-blend-multiply" />
            <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[450px] bg-[#1e5138]/30 rounded-[100px] rotate-[-10deg] pointer-events-none z-0 mix-blend-multiply" />

            <div className="w-full max-w-[1300px] flex flex-col relative z-10">
                <NavigationTabs />
                <UploadStatsSection stats={stats} globalVolume={globalVolume} />

                <header className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-gray-900">Ajoutez vos données</h2>
                        <p className="text-xs text-gray-500 mt-1 font-semibold">Choisissez la méthode adaptée pour alimenter votre tableau de bord.</p>
                    </div>

                    <div className="flex bg-gray-100/80 backdrop-blur p-1 rounded-full border border-gray-200 shadow-sm w-fit self-start sm:self-auto">
                        <button
                            onClick={() => setActiveSubTab('import')}
                            className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-full transition-all duration-200 ${
                                activeSubTab === 'import' ? 'bg-[#1e5138] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <UploadCloud className="w-3.5 h-3.5" />
                            Importation
                        </button>
                        <button
                            onClick={() => setActiveSubTab('analysis')}
                            className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-full transition-all duration-200 relative ${
                                activeSubTab === 'analysis' ? 'bg-[#1e5138] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
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

                <div className="mb-6">
                    <RapportHistorySelect
                        history={history}
                        loading={historyLoading}
                        onSelect={(rapport: RapportEntity) => {
                            if (rapport?.id) {
                                setSelectedRapportId(rapport.id);
                            }
                            if (rapport?.content) {
                                loadRapport(rapport.content);
                            }
                        }}
                        label="Revoir une ancienne analyse..."
                    />
                </div>

                {uploadError && (
                    <div className="w-full mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-2xl flex items-start gap-3 shadow-sm">
                        <AlertTriangle className="text-red-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-bold text-red-800">Fichier non conforme</h4>
                            <p className="text-xs text-red-700 mt-0.5 font-medium">{uploadError}</p>
                        </div>
                    </div>
                )}

                {activeSubTab === 'import' ? (
                    <div className="w-full flex flex-col gap-6 animate-fade-in">
                        <div className="flex flex-col gap-6 w-full">
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                <div className="lg:col-span-3">
                                    <UploadActionCard
                                        title="Fichier (CSV/Excel)"
                                        description="Glissez vos fichiers comptables ou exports de vente."
                                        buttonText={isUploading ? "Analyse..." : "Sélectionner"}
                                        icon={UploadCloud}
                                        onClick={handleFileSelect}
                                    />
                                </div>
                                <div className="lg:col-span-2">
                                    <UploadActionCard
                                        title="Connecter une source"
                                        description="Synchronisation en temps réel avec vos ERP/Banques."
                                        buttonText="Connecter"
                                        icon={Link2}
                                        onClick={() => setIsDbModalOpen(true)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
                                <div className="lg:col-span-2">
                                    <UploadActionCard
                                        title="Photographier"
                                        description="Scannez vos reçus et factures papier via l'OCR."
                                        buttonText="Scanner"
                                        icon={Camera}
                                        onClick={handleStartScan}
                                    />
                                </div>
                                <div className="lg:col-span-3 h-full">
                                    <AnalysisProgressCard analysis={analysis} />
                                </div>
                            </div>
                        </div>

                        <div className="w-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <h3 className="text-sm font-bold text-gray-900">Fichiers récents traités</h3>
                            </div>

                            {recentDocuments.length === 0 ? (
                                <p className="text-xs text-gray-400 italic py-2">Aucun document traité pour le moment.</p>
                            ) : (
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left border-collapse min-w-[500px]">
                                        <thead>
                                        <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            <th className="pb-3 w-1/2">Nom du fichier</th>
                                            <th className="pb-3">Format</th>
                                            <th className="pb-3">Date</th>
                                            <th className="pb-3">Taille</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                        {recentDocuments.map((doc, idx) => (
                                            <tr key={doc.id || idx} className="hover:bg-gray-50/60 transition-colors">
                                                <td className="py-3 px-1">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-4 h-4 text-[#1e5138] flex-shrink-0" />
                                                        <span className="text-xs font-semibold text-gray-700 truncate max-w-[180px] md:max-w-[280px]">
                                                                {doc.name}
                                                            </span>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase bg-gray-100 px-2 py-0.5 rounded-md">
                                                            {doc.type}
                                                        </span>
                                                </td>
                                                <td className="py-3 text-xs text-gray-500 font-medium">
                                                    {formatRelativeDate(doc.upload_date)}
                                                </td>
                                                <td className="py-3 text-xs text-gray-500 font-medium">
                                                    {((doc.taille || 0) / 1024).toFixed(1)} KB
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="w-full mb-6 animate-fade-in flex flex-col gap-6">
                        {analysisResult ? (
                            <>
                                <AnalysisResultCard
                                    filename={extractedFileName}
                                    rawFile={lastUploadedFile || undefined}
                                    explications={extractedExplications}
                                    statistiques={{
                                        lignesNettoyees: statsObj?.lignes_traitees ?? 0,
                                        valeursManquantesCorrigees: statsObj?.valeurs_manquantes_corrigees ?? 0,
                                        anomaliesDetectees: statsObj?.anomalies_detectees ?? 0,
                                    }}
                                    exportFormat="csv"
                                />

                                <PreprocessResultSection result={analysisResult} />
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm flex flex-col items-center justify-center">
                                <FileText className="w-12 h-12 text-gray-300 mb-3" />
                                <h3 className="text-sm font-bold text-gray-700">Aucune donnée disponible</h3>
                                <p className="text-xs text-gray-400 mt-1 max-w-sm">
                                    Veuillez d'abord téléverser un fichier dans l'onglet <strong>Importation</strong>.
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

            <KlaaroChatDrawer
                activeRapportId={selectedRapportId}
                chartData={chartDataForKlaaro}
            />
        </div>
    );
}
