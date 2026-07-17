import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "./useAuth.ts";
import { useLocalStorageState } from "./useLocalStorageState.ts";
import { HttpDocumentRepository } from "../../infrastructure/api/HttpDocumentRepository.ts";
import { HttpRapportRepository } from "../../infrastructure/api/HttpRapportRepository.ts";
import type { UploadStats } from "../../entities/UploadStats.ts";
import type { DocumentEntity } from "../../entities/Document.ts";

const docRepo = new HttpDocumentRepository();
const rapportRepo = new HttpRapportRepository();

export interface PreprocessRapport {
    lignes_avant: number;
    lignes_apres: number;
    colonnes_avant: string[];
    colonnes_apres: string[];
    actions: string[];
}

export interface ChartDataItem {
    name: string | number;
    valeur: number;
}

// Représente un bloc graphique complet généré par ton service ML
export interface PreparedChart {
    type: 'bar' | 'line' | 'scatter' | 'pie';
    title: string;
    reason: string;
    explanation: string;
    colonne_choisie?: string;
    data: ChartDataItem[];
}

export interface PreprocessResponse {
    status: string;
    format_origine: string;
    charts: PreparedChart[]; // L'API renvoie désormais ce tableau de graphiques
    rapport: PreprocessRapport;
    apercu_donnees: Array<Record<string, any>>;
}

export function useUploadDashboard() {
    const { user, token } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    // États Klaaro ML — persistés en localStorage (cache instantané) ET en base
    // via l'entité Rapport (type: "preprocessing"), pour survivre à la navigation,
    // au refresh, et être réellement consultables plus tard depuis un autre appareil.
    const [analysisResult, setAnalysisResult] = useLocalStorageState<PreprocessResponse | null>('klaaro_last_analysis', null);
    const [lastAnalysisFileName, setLastAnalysisFileName] = useLocalStorageState<string | null>('klaaro_last_analysis_filename', null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    // Historique des documents
    const [recentDocuments, setRecentDocuments] = useState<DocumentEntity[]>([]);

    const [stats, setStats] = useState<UploadStats>({
        uploadedFilesCount: 0,
        uploadedFilesTrend: 0,
        databaseConnectionsCount: 0,
        scannedPhotosCount: 0,
        scannedPhotosMax: 50
    });

    const [analysis, setAnalysis] = useState({
        fileName: "Aucun fichier en cours",
        fileSize: "0 KB",
        progressPercentage: 0,
        steps: { ocr: 'idle', categorization: 'idle', fiscalImpact: 'idle' }
    });

    const globalVolume = stats.uploadedFilesCount + stats.databaseConnectionsCount + stats.scannedPhotosCount;

    const loadRecentDocuments = useCallback(async () => {
        if (token) {
            try {
                const docs = await docRepo.getRecentDocuments(token);
                setRecentDocuments(docs);
            } catch (err) {
                console.error("Erreur lors de la récupération des documents récents :", err);
            }
        }
    }, [token]);

    const refreshStats = useCallback(async () => {
        if (user?.id && token) {
            try {
                const data = await docRepo.getStatsByUserId(token);
                setStats({
                    uploadedFilesCount: data.uploadedFilesCount ?? 0,
                    uploadedFilesTrend: data.uploadedFilesTrend ?? 0,
                    databaseConnectionsCount: data.databaseConnectionsCount ?? 0,
                    scannedPhotosCount: data.scannedPhotosCount ?? 0,
                    scannedPhotosMax: data.scannedPhotosMax ?? 50
                });
            } catch (err) {
                console.error("Erreur stats (Vérifie la méthode HTTP/URL sur le backend):", err);
            }
        }
    }, [user?.id, token]);

    const loadLatestAnalysis = useCallback(async () => {
        if (!token) return;
        try {
            const latest = await rapportRepo.getLatestRapportByType(token, 'preprocessing');

            // 1. On vérifie si "latest" existe et n'est pas vide avant d'essayer de parser
            if (latest && latest.content && latest.content.trim() !== "") {
                const stored = JSON.parse(latest.content) as { result: PreprocessResponse; fileName: string };
                setAnalysisResult(stored.result);
                setLastAnalysisFileName(stored.fileName);
            } else {
                console.log("Aucune analyse précédente trouvée en base de données.");
            }
        } catch (err) {
            // L'erreur est capturée ici et ne fait plus planter l'application
            console.warn("Impossible de recharger la dernière analyse (vide ou inexistante) :", err);
        }
    }, [token]);

    const persistAnalysis = async (result: PreprocessResponse, fileName: string) => {
        if (!token) return;
        try {
            await rapportRepo.createRapport({
                type: 'preprocessing',
                content: JSON.stringify({ result, fileName }),
                periode: new Date().toISOString()
            }, token);
        } catch (err) {
            console.error("Échec de la sauvegarde de l'analyse en base :", err);
        }
    };

    // Initialisation au chargement du composant
    useEffect(() => {
        if (token) {
            refreshStats();
            loadRecentDocuments();
            loadLatestAnalysis();
        }
    }, [token, refreshStats, loadRecentDocuments, loadLatestAnalysis]);

    const saveToDocumentRepository = (file: File, isImage: boolean): Promise<void> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = async () => {
                try {
                    const base64Content = reader.result as string;
                    const lowerName = file.name.toLowerCase();

                    let docType: 'csv' | 'excel' | 'json' | 'pdf' | 'xml' | 'image' = 'json';
                    if (isImage) docType = 'image';
                    else if (lowerName.endsWith('.csv')) docType = 'csv';
                    else if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) docType = 'excel';
                    else if (lowerName.endsWith('.pdf')) docType = 'pdf';
                    else if (lowerName.endsWith('.xml')) docType = 'xml';

                    setAnalysis(prev => ({
                        ...prev,
                        progressPercentage: 60,
                        steps: { ...prev.steps, ocr: 'completed', categorization: 'processing' }
                    }));

                    await docRepo.uploadDocument({
                        name: file.name,
                        type: docType,
                        taille: file.size,
                        content: base64Content
                    }, token!);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error("Erreur lors de la lecture locale du fichier."));
            reader.readAsDataURL(file);
        });
    };

    const processUpload = async (file: File, isImage: boolean) => {
        if (!user?.id || !token) return;

        setIsUploading(true);
        setUploadError(null);

        setAnalysis({
            fileName: file.name,
            fileSize: `${(file.size / 1024).toFixed(1)} KB`,
            progressPercentage: 10,
            steps: { ocr: isImage ? 'processing' : 'completed', categorization: 'idle', fiscalImpact: 'idle' }
        });

        // ÉTAPE 1 : Appel & Validation ML de l'API FastAPI
        if (!isImage) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('http://localhost:8000/ml/preprocess', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 404) {
                    throw new Error("L'URL /ml/preprocess n'est pas trouvée. Vérifie l'inclusion de ml_router dans ton main.py.");
                }

                const mlData = await response.json();

                if (!response.ok) {
                    throw new Error(mlData.detail || "Le document a été refusé par l'analyseur.");
                }

                setAnalysisResult(mlData as PreprocessResponse);
                setLastAnalysisFileName(file.name);

                setAnalysis(prev => ({
                    ...prev,
                    progressPercentage: 40
                }));

                // 🗄️ Sauvegarde en base pour survivre à la navigation, au refresh,
                // et pour pouvoir "Revoir" une vraie ancienne analyse plus tard.
                await persistAnalysis(mlData as PreprocessResponse, file.name);

            } catch (err: any) {
                const errMsg = err.message || "Erreur lors du traitement ML.";
                setUploadError(errMsg);
                setAnalysis(prev => ({ ...prev, fileName: "Fichier refusé/Erreur API" }));
                setIsUploading(false);
                return;
            }
        }

        // ÉTAPE 2 : Sauvegarde dans ta DB (uniquement si l'étape 1 a réussi ou si c'est une image)
        try {
            await saveToDocumentRepository(file, isImage);

            setAnalysis(prev => ({
                ...prev,
                progressPercentage: 100,
                steps: { ocr: 'completed', categorization: 'completed', fiscalImpact: 'processing' }
            }));

            await refreshStats();
            await loadRecentDocuments();
        } catch (error) {
            console.error(error);
            setUploadError("Fichier validé par le ML, mais échec de la synchronisation de stockage interne.");
            setAnalysis(prev => ({ ...prev, fileName: "Erreur sauvegarde DB" }));
        } finally {
            setIsUploading(false);
        }
    };

    // Recharge un rapport de type "preprocessing" choisi dans l'historique
    const loadRapport = (content: string) => {
        try {
            const stored = JSON.parse(content) as { result: PreprocessResponse; fileName: string };
            setAnalysisResult(stored.result);
            setLastAnalysisFileName(stored.fileName);
        } catch (err) {
            console.error("Rapport d'analyse illisible :", err);
        }
    };

    return {
        stats,
        analysis,
        globalVolume,
        fileInputRef,
        cameraInputRef,
        analysisResult,
        setAnalysisResult,
        lastAnalysisFileName,
        loadRapport,
        recentDocuments,
        uploadError,
        isUploading,
        handleFileSelect: () => fileInputRef.current?.click(),
        handleStartScan: () => cameraInputRef.current?.click(),
        onFileChange: (e: React.ChangeEvent<HTMLInputElement>, isImage: boolean) => {
            const file = e.target.files?.[0];
            if (file) processUpload(file, isImage);
        },
        refreshStats
    };
}