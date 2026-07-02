import { useState } from 'react';
import {type AnalysisStatus, calculateGlobalVolume, type UploadStats} from "../../entities/UploadStats.ts";

export function useUploadDashboard() {
    // Simulation de récupération des statistiques métier
    const [stats] = useState<UploadStats>({
        uploadedFilesCount: 35,
        uploadedFilesTrend: 4,
        databaseConnectionsCount: 12,
        scannedPhotosCount: 16,
        scannedPhotosMax: 20
    });

    // État de l'analyse en cours
    const [analysis] = useState<AnalysisStatus>({
        fileName: "Facture_A2402_Client_X.pdf",
        fileSize: "1.2 MB",
        progressPercentage: 74,
        steps: {
            ocr: 'completed',
            categorization: 'completed',
            fiscalImpact: 'processing'
        }
    });

    // Calcul du volume total via la fonction pure du domaine
    const globalVolume = calculateGlobalVolume(stats);

    // Déclencheurs d'actions utilisateur
    const handleFileSelect = () => console.log('Action: Sélectionner un fichier');
    const handleConnectSource = () => console.log('Action: Connecter une source ERP/Banque');
    const handleStartScan = () => console.log('Action: Démarrer le scan OCR');

    return {
        stats,
        analysis,
        globalVolume,
        handleFileSelect,
        handleConnectSource,
        handleStartScan
    };
}