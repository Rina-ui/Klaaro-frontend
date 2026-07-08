import React, { useState } from 'react';
import { UploadCloud, Link2, Camera } from 'lucide-react';
import {useUploadDashboard} from "../../../use_cases/hooks/useUploadDashboard.ts";
import NavigationTabs from "../../components/ui/NavigationTabs.tsx";
import UploadStatsSection from "./UploadStatsSection.tsx";
import UploadActionCard from "./UploadActionCard.tsx";
import AnalysisProgressCard from "./AnalysisProgressCard.tsx";
import ConnectDatabaseModal from "./ConnectDatabaseModal.tsx";


export default function UploadPage(): React.JSX.Element {
    const [isDbModalOpen, setIsDbModalOpen] = useState(false);

    const {
        stats,
        analysis,
        globalVolume,
        handleFileSelect,
        handleStartScan
    } = useUploadDashboard();

    return (
        <div className="w-full text-[#1a1a1a] font-sans p-4 md:p-8 antialiased flex flex-col items-center min-h-screen relative overflow-hidden">
            {/* Arrière-plans décoratifs... */}
            <div className="absolute top-[-10%] right-[-15%] w-[750px] h-[700px] bg-[#1e5138]/15 rounded-[160px] rotate-[15deg] pointer-events-none z-0 mix-blend-multiply" />
            <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[450px] bg-[#1e5138]/30 rounded-[100px] rotate-[-10deg] pointer-events-none z-0 mix-blend-multiply" />
            <div className="absolute top-[-5%] left-[-10%] w-[400px] h-[300px] bg-[#1e5138]/10 rounded-[80px] rotate-[-25deg] pointer-events-none z-0 mix-blend-multiply" />

            <div className="w-full max-w-[1300px] flex flex-col relative z-10">
                <NavigationTabs />
                <UploadStatsSection stats={stats} globalVolume={globalVolume} />

                <header className="mb-6">
                    <h2 className="text-3xl font-black tracking-tight text-gray-900">Ajoutez vos données</h2>
                    <p className="text-xs text-gray-500 mt-1 font-semibold">Choisissez la méthode adaptée pour alimenter votre tableau de bord.</p>
                </header>

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
            </div>

            {/* Ajout du Modal à la fin de la page */}
            <ConnectDatabaseModal
                isOpen={isDbModalOpen}
                onClose={() => setIsDbModalOpen(false)}
                onSuccess={() => {
                    console.log("Configuration de la base externe ajoutée !");
                }}
            />
        </div>
    );
}