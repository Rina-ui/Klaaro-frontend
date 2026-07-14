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
    name: string;
    valeur: number;
}

export interface PreprocessResponse {
    status: string;
    format_origine: string;
    rapport: PreprocessRapport;
    chart_data: ChartDataItem[];
    apercu_donnees: Array<Record<string, any>>;
}

export function useUploadDashboard() {
    const { user, token } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    // 🗄️ Cache instantané en localStorage : évite l'écran vide le temps que le
    // GET /rapports/user/{id} réponde, et sert de filet de secours si jamais
    // la sauvegarde backend échoue pour une raison ou une autre.
    const [analysisResult, setAnalysisResult] = useLocalStorageState<PreprocessResponse | null>('klaaro_last_analysis', null);

    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
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
                setStats(data);
            } catch (err) {
                console.error("Erreur stats (Vérifie la méthode HTTP/URL sur le backend):", err);
            }
        }
    }, [user?.id, token]);

    // 🗄️ Récupère la dernière analyse sauvegardée en base au montage,
    // pour réhydrater l'écran même après un changement de page complet
    // (nouvel onglet, autre navigateur, etc. — pas seulement le cache local).
    const loadLatestAnalysis = useCallback(async () => {
        if (!user?.id || !token) return;
        try {
            const latest = await rapportRepo.getLatestRapportByType(token, user.id, 'preprocessing');
            if (latest) {
                setAnalysisResult(JSON.parse(latest.content) as PreprocessResponse);
            }
        } catch (err) {
            console.error("Impossible de recharger la dernière analyse depuis le backend :", err);
            // On garde silencieusement ce qu'il y avait dans le cache localStorage
        }
    }, [user?.id, token, setAnalysisResult]);

    useEffect(() => {
        if (token) {
            refreshStats();
            loadRecentDocuments();
            loadLatestAnalysis();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, refreshStats, loadRecentDocuments]);

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

    // 🗄️ Sauvegarde le résultat ML en base sous forme de Rapport, pour qu'il
    // survive à la navigation, au refresh, et soit consultable depuis n'importe
    // quel appareil connecté au même compte.
    const persistAnalysisResult = async (result: PreprocessResponse) => {
        if (!token) return;
        try {
            await rapportRepo.createRapport({
                type: 'preprocessing',
                content: JSON.stringify(result),
                periode: new Date().toISOString()
            }, token);
        } catch (err) {
            console.error("Échec de la sauvegarde du rapport d'analyse en base :", err);
            // Non bloquant : l'utilisateur voit quand même son résultat (cache localStorage)
        }
    };

    const processUpload = async (file: File, isImage: boolean) => {
        if (!user?.id || !token) return;

        setIsUploading(true);
        setUploadError(null);
        setAnalysisResult(null);

        setAnalysis({
            fileName: file.name,
            fileSize: `${(file.size / 1024).toFixed(1)} KB`,
            progressPercentage: 10,
            steps: { ocr: isImage ? 'processing' : 'completed', categorization: 'idle', fiscalImpact: 'idle' }
        });

        if (!isImage) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('http://localhost:8000/ml/preprocess', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.status === 404) {
                    throw new Error("L'URL /ml/preprocess n'est pas trouvée. Vérifie l'inclusion de ml_router dans ton main.py.");
                }

                const mlData = await response.json();

                if (!response.ok) {
                    throw new Error(mlData.detail || "Le document a été refusé par l'analyseur.");
                }

                setAnalysisResult(mlData as PreprocessResponse);
                await persistAnalysisResult(mlData as PreprocessResponse);

                setAnalysis(prev => ({ ...prev, progressPercentage: 40 }));

            } catch (err: any) {
                const errMsg = err.message || "Erreur lors du traitement ML.";
                setUploadError(errMsg);
                setAnalysis(prev => ({ ...prev, fileName: "Fichier refusé/Erreur API" }));
                setIsUploading(false);
                return;
            }
        }

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

    return {
        stats,
        analysis,
        globalVolume,
        fileInputRef,
        cameraInputRef,
        analysisResult,
        setAnalysisResult,
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
