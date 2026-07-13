import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "./useAuth.ts";
import { HttpDocumentRepository } from "../../infrastructure/api/HttpDocumentRepository.ts";
import type { UploadStats } from "../../entities/UploadStats.ts";

const docRepo = new HttpDocumentRepository();

// --- INTERFACES POUR LE PRETRAITEMENT ML ---
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

    // États Klaaro ML
    const [analysisResult, setAnalysisResult] = useState<PreprocessResponse | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

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

    useEffect(() => {
        if (token) {
            refreshStats();
        }
    }, [token, refreshStats]);

    // Fonction isolée pour gérer proprement l'envoi au DocumentRepository historique
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
        setAnalysisResult(null);

        setAnalysis({
            fileName: file.name,
            fileSize: `${(file.size / 1024).toFixed(1)} KB`,
            progressPercentage: 10,
            steps: { ocr: isImage ? 'processing' : 'completed', categorization: 'idle', fiscalImpact: 'idle' }
        });

        //ÉTAPE 1 : Appel & Validation ML de l'API FastAPI
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

                // Si l'application FastAPI renvoie un 404 (Route manquante)
                if (response.status === 404) {
                    throw new Error("L'URL /ml/preprocess n'est pas trouvée. Vérifie l'inclusion de ml_router dans ton main.py.");
                }

                const mlData = await response.json();

                if (!response.ok) {
                    throw new Error(mlData.detail || "Le document a été refusé par l'analyseur.");
                }

                setAnalysisResult(mlData as PreprocessResponse);

                setAnalysis(prev => ({
                    ...prev,
                    progressPercentage: 40
                }));

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