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
        // 🔥 Enveloppe configurée en relative/overflow-hidden pour contenir nos formes artistiques uniques
        <div className="w-full text-[#1a1a1a] font-sans p-4 md:p-8 antialiased flex flex-col items-center min-h-screen relative overflow-hidden">

            {/* ================= BACKGROUND : CONFIGURATION UNIQUE POUR LA PAGE UPLOAD ================= */}
            {/* 1. Un grand bandeau fluide oblique sur tout le côté DROIT */}
            <div className="absolute top-[-10%] right-[-15%] w-[750px] h-[700px] bg-[#1e5138]/15 rounded-[160px] rotate-[15deg] pointer-events-none z-0 mix-blend-multiply" />

            {/* 2. Une ondulation de peinture très prononcée en bas à droite pour habiller la fin des grilles */}
            <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[450px] bg-[#1e5138]/30 rounded-[100px] rotate-[-10deg] pointer-events-none z-0 mix-blend-multiply" />

            {/* 3. Une touche discrète en haut à gauche pour casser le vide près de la navigation */}
            <div className="absolute top-[-5%] left-[-10%] w-[400px] h-[300px] bg-[#1e5138]/10 rounded-[80px] rotate-[-25deg] pointer-events-none z-0 mix-blend-multiply" />
            {/* ========================================================================================= */}

            {/* Le contenu est propulsé au z-10 pour survoler les touches vertes */}
            <div className="w-full max-w-[1300px] flex flex-col relative z-10">

                {/* BARRE DE NAVIGATION PROPRE ET ACTIVE (SANS DOUBLONS) */}
                <NavigationTabs />

                {/* BLOC DES STATISTIQUES ENCAPSULÉ */}
                <UploadStatsSection stats={stats} globalVolume={globalVolume} />

                {/* TITRE PRINCIPAL */}
                <header className="mb-6">
                    <h2 className="text-3xl font-black tracking-tight text-gray-900">Ajoutez vos données</h2>
                    <p className="text-xs text-gray-500 mt-1 font-semibold">Choisissez la méthode adaptée pour alimenter votre tableau de bord.</p>
                </header>

                {/* GRILLE DES ACTIONS */}
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