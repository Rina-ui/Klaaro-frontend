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
    charts: PreparedChart[];
    rapport: PreprocessRapport;
    apercu_donnees: Array<Record<string, any>>;
}

// Forme réelle renvoyée par ocr_service.extract_structured_data(...)
export interface OcrExtractResponse {
    texte_brut: string[];
    montants_detectes: number[];
    dates_detectees: string[];
    texte_complet: string;
}

export function useUploadDashboard() {
    const { user, token } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    // ✅ ÉTATS REACT PURS (Sécurité inter-utilisateurs & zéro fuite dans le localStorage)
    const [analysisResult, setAnalysisResult] = useState<PreprocessResponse | null>(null);
    const [lastAnalysisFileName, setLastAnalysisFileName] = useState<string | null>(null);

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

    // ✅ Charge la dernière analyse appartenant EXCLUSIVEMENT à l'utilisateur connecté via JWT
    const loadLatestAnalysis = useCallback(async () => {
        if (!token) return;
        try {
            const latest = await rapportRepo.getLatestRapportByType(token, 'preprocessing');

            if (latest && latest.content && latest.content.trim() !== "") {
                const stored = JSON.parse(latest.content) as { result: PreprocessResponse; fileName: string };
                setAnalysisResult(stored.result);
                setLastAnalysisFileName(stored.fileName);
            } else {
                // Si l'utilisateur n'a pas encore fait d'analyse, réinitialiser explicitement les états
                setAnalysisResult(null);
                setLastAnalysisFileName(null);
            }
        } catch (err) {
            console.warn("Impossible de recharger la dernière analyse (vide ou inexistante) :", err);
            setAnalysisResult(null);
            setLastAnalysisFileName(null);
        }
    }, [token]);

    const persistAnalysis = async (result: PreprocessResponse | OcrExtractResponse, fileName: string) => {
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

    // Initialisation au chargement du composant ou au changement de compte (jeton JWT)
    useEffect(() => {
        if (token) {
            refreshStats();
            loadRecentDocuments();
            loadLatestAnalysis();
        } else {
            // Nettoyage complet lors de la déconnexion
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

        // ÉTAPE 1a : Cas PHOTO -> route OCR (/ocr/extract)
        if (isImage) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('http://localhost:8000/ocr/extract', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 404) {
                    throw new Error("L'URL /ocr/extract n'est pas trouvée. Vérifie l'inclusion du router OCR dans main.py.");
                }

                const ocrData = (await response.json()) as OcrExtractResponse;

                if (!response.ok) {
                    throw new Error((ocrData as any).detail || "L'image n'a pas pu être lue par l'OCR.");
                }

                // On adapte la réponse OCR à la forme attendue par PreprocessResultSection,
                // pour que l'affichage marche pareil que pour un CSV/Excel, sans dupliquer l'UI.
                const montants = ocrData.montants_detectes ?? [];
                const dates = ocrData.dates_detectees ?? [];
                const lignesTexte = ocrData.texte_brut ?? [];

                let apercuDonnees: Array<Record<string, any>>;
                let colonnes: string[];
                const actions: string[] = [];

                if (montants.length > 0) {
                    // Cas normal : un ticket/facture avec des montants reconnus -> on
                    // reconstitue les mêmes lignes que image_to_dataframe côté backend.
                    apercuDonnees = montants.map((montant, i) => ({
                        ligne: i + 1,
                        montant,
                        date: dates[i] ?? null,
                        source: "OCR"
                    }));
                    colonnes = ["ligne", "montant", "date", "source"];
                    actions.push(`${montants.length} montant(s) détecté(s) sur l'image`);
                    if (dates.length > 0) actions.push(`${dates.length} date(s) détectée(s)`);
                } else {
                    // Repli : aucun montant reconnu, on affiche au moins le texte brut ligne
                    // par ligne pour que l'utilisateur voie ce que l'OCR a lu, plutôt qu'un
                    // aperçu vide.
                    apercuDonnees = lignesTexte.map((texte, i) => ({ ligne: i + 1, texte }));
                    colonnes = ["ligne", "texte"];
                    actions.push("Aucun montant reconnu automatiquement, texte brut affiché");
                }

                const adaptedResult: PreprocessResponse = {
                    status: "success",
                    format_origine: "image",
                    charts: [],
                    rapport: {
                        lignes_avant: lignesTexte.length,
                        lignes_apres: apercuDonnees.length,
                        colonnes_avant: colonnes,
                        colonnes_apres: colonnes,
                        actions
                    },
                    apercu_donnees: apercuDonnees
                };

                setAnalysisResult(adaptedResult);
                setLastAnalysisFileName(file.name);

                setAnalysis(prev => ({
                    ...prev,
                    progressPercentage: 40,
                    steps: { ...prev.steps, ocr: 'completed', categorization: 'processing' }
                }));

                await persistAnalysis(adaptedResult, file.name);

            } catch (err: any) {
                const errMsg = err.message || "Erreur lors de la lecture OCR de l'image.";
                setUploadError(errMsg);
                setAnalysis(prev => ({ ...prev, fileName: "Image refusée/Erreur OCR" }));
                setIsUploading(false);
                return;
            }
        }

        // ÉTAPE 1b : Cas FICHIER (csv/xlsx/etc.) -> route ML (/ml/preprocess)
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

                await persistAnalysis(mlData as PreprocessResponse, file.name);

            } catch (err: any) {
                const errMsg = err.message || "Erreur lors du traitement ML.";
                setUploadError(errMsg);
                setAnalysis(prev => ({ ...prev, fileName: "Fichier refusé/Erreur API" }));
                setIsUploading(false);
                return;
            }
        }

        // ÉTAPE 2 : Sauvegarde dans ta BDD (stockage binaire/document)
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
            setUploadError("Fichier validé, mais échec de la synchronisation de stockage interne.");
            setAnalysis(prev => ({ ...prev, fileName: "Erreur sauvegarde DB" }));
        } finally {
            setIsUploading(false);
        }
    };

    // Recharge un rapport d'analyse choisi dans l'historique de la BDD
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