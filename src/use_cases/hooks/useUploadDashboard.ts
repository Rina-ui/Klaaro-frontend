import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "./useAuth.ts";
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

export interface PreparedChart {
    type: 'bar' | 'line' | 'scatter' | 'pie';
    title: string;
    reason: string;
    explanation: string;
    colonne_choisie?: string;
    data: ChartDataItem[];
}

// 🎯 Interface mise à jour pour recevoir l'explication d'Ollama
export interface PreprocessResponse {
    status: string;
    format_origine: string;
    explanation?: string;
    explications?: string;
    charts?: PreparedChart[];
    rapport?: PreprocessRapport;
    apercu_donnees?: Array<Record<string, any>>;
    stats?: {
        lignes_traitees?: number;
        valeurs_manquantes_corrigees?: number;
        anomalies_detectees?: number;
    };
    filename?: string;
}

export function useUploadDashboard() {
    const { user, token } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const [analysisResult, setAnalysisResult] = useState<PreprocessResponse | null>(null);
    const [lastAnalysisFileName, setLastAnalysisFileName] = useState<string | null>(null);

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
                setStats({
                    uploadedFilesCount: data.uploadedFilesCount ?? 0,
                    uploadedFilesTrend: data.uploadedFilesTrend ?? 0,
                    databaseConnectionsCount: data.databaseConnectionsCount ?? 0,
                    scannedPhotosCount: data.scannedPhotosCount ?? 0,
                    scannedPhotosMax: data.scannedPhotosMax ?? 50
                });
            } catch (err) {
                console.error("Erreur stats :", err);
            }
        }
    }, [user?.id, token]);

    const loadLatestAnalysis = useCallback(async () => {
        if (!token) return;
        try {
            const latest = await rapportRepo.getLatestRapportByType(token, 'preprocessing');

            if (latest && latest.content && latest.content.trim() !== "") {
                const stored = JSON.parse(latest.content) as { result: PreprocessResponse; fileName: string };
                setAnalysisResult(stored.result);
                setLastAnalysisFileName(stored.fileName);
            } else {
                setAnalysisResult(null);
                setLastAnalysisFileName(null);
            }
        } catch (err) {
            console.warn("Impossible de recharger la dernière analyse :", err);
            setAnalysisResult(null);
            setLastAnalysisFileName(null);
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

    useEffect(() => {
        if (token) {
            refreshStats();
            loadRecentDocuments();
            loadLatestAnalysis();
        } else {
            setAnalysisResult(null);
            setLastAnalysisFileName(null);
            setRecentDocuments([]);
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

        // ÉTAPE 1 : Appel de /ml/explain pour obtenir à la fois l'analyse et la synthèse Ollama
        if (!isImage) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('http://localhost:8000/ml/explain', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 404) {
                    throw new Error("L'URL /ml/explain n'est pas trouvée sur le backend FastAPI.");
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

                // Sauvegarde en base de données
                await persistAnalysis(mlData as PreprocessResponse, file.name);

            } catch (err: any) {
                const errMsg = err.message || "Erreur lors de la génération des explications.";
                setUploadError(errMsg);
                setAnalysis(prev => ({ ...prev, fileName: "Fichier refusé/Erreur API" }));
                setIsUploading(false);
                return;
            }
        }

        // ÉTAPE 2 : Sauvegarde dans le dépôt binaire
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
            setUploadError("Fichier analysé par le ML, mais échec de la synchronisation de stockage interne.");
            setAnalysis(prev => ({ ...prev, fileName: "Erreur sauvegarde DB" }));
        } finally {
            setIsUploading(false);
        }
    };

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