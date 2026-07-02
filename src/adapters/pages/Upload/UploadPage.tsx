import React from 'react';
import { UploadCloud, Link2, Camera } from 'lucide-react';
import { useUploadDashboard } from "../../../use_cases/hooks/useUploadDashboard.ts";
import UploadStatsSection from "./UploadStatsSection.tsx";
import UploadActionCard from "./UploadActionCard.tsx";
import AnalysisProgressCard from "./AnalysisProgressCard.tsx";
import NavigationTabs from "../../components/ui/NavigationTabs.tsx";

export default function UploadPage(): React.JSX.Element {
    const {
        stats,
        analysis,
        globalVolume,
        handleFileSelect,
        handleConnectSource,
        handleStartScan
    } = useUploadDashboard();

    return (
        <div className="min-h-screen bg-[#e2e4e3] text-[#1a1a1a] font-sans p-4 md:p-8 antialiased flex flex-col items-center">
            <div className="w-full max-w-[1300px] flex flex-col">

                {/* BARRE DE NAVIGATION PROPRE ET ACTIVE (SANS DOUBLONS) */}
                <NavigationTabs />

                {/* BLOC DES STATISTIQUES ENCAPSULÉ */}
                <UploadStatsSection stats={stats} globalVolume={globalVolume} />

                {/* TITRE PRINCIPAL */}
                <header className="mb-6">
                    <h2 className="text-3xl font-black tracking-tight text-gray-900">Ajoutez vos données</h2>
                    <p className="text-xs text-gray-500 mt-1 font-semibold">Choisissez la méthode adaptée pour alimenter votre tableau de bord.</p>
                </header>

                {/* GRILLE DES ACTIONS DEVENUE ULTRA-PROPRE */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                    <UploadActionCard
                        title="Importer un fichier (CSV/Excel)"
                        description="Glissez vos fichiers comptables ou vos exports de vente. Klaaro supporte tous les formats standards de données d'entreprise."
                        buttonText="Sélectionner un fichier"
                        icon={UploadCloud}
                        onClick={handleFileSelect}
                        isLarge={true}
                    />

                    <UploadActionCard
                        title="Connecter une source"
                        description="Synchronisation en temps réel et sécurisée avec vos comptes bancaires ou votre infrastructure ERP."
                        buttonText="Connecter"
                        icon={Link2}
                        onClick={handleConnectSource}
                    />

                    <UploadActionCard
                        title="Photographier un document"
                        description="Scannez vos reçus, notes de frais et factures papier via notre module OCR intelligent."
                        buttonText="Démarrer le scan"
                        icon={Camera}
                        onClick={handleStartScan}
                    />

                    {/* BLOC DE PROGRESSION ENCAPSULÉ */}
                    <AnalysisProgressCard analysis={analysis} />

                </div>
            </div>
        </div>
    );
}