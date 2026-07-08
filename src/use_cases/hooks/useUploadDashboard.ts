import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "./useAuth.ts";
import { HttpDocumentRepository } from "../../infrastructure/api/HttpDocumentRepository.ts";
import type { UploadStats } from "../../entities/UploadStats.ts";

const docRepo = new HttpDocumentRepository();

export function useUploadDashboard() {
    const { user, token } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

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

    // Encapsulé dans useCallback pour éviter les cascading renders du useEffect
    const refreshStats = useCallback(async () => {
        if (user?.id && token) {
            try {
                const data = await docRepo.getStatsByUserId(token);
                setStats(data);
            } catch (err) {
                console.error(err);
            }
        }
    }, [user?.id, token]);

    // Appel propre sans warning exhaustive-deps
    useEffect(() => {
        if (token) {
            refreshStats();
        }
    }, [token, refreshStats]);

    const processUpload = async (file: File, isImage: boolean) => {
        if (!user?.id || !token) return;

        setAnalysis({
            fileName: file.name,
            fileSize: `${(file.size / 1024).toFixed(1)} KB`,
            progressPercentage: 10,
            steps: { ocr: isImage ? 'processing' : 'completed', categorization: 'idle', fiscalImpact: 'idle' }
        });

        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const base64Content = reader.result as string;
                const lowerName = file.name.toLowerCase();

                // Aligné sur le type strict attendu par le payload du repository
                let docType: 'csv' | 'excel' | 'json' | 'pdf' | 'xml' | 'image' = 'json';

                if (isImage) {
                    docType = 'image';
                } else if (lowerName.endsWith('.csv')) {
                    docType = 'csv';
                } else if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) {
                    docType = 'excel';
                } else if (lowerName.endsWith('.pdf')) {
                    docType = 'pdf';
                } else if (lowerName.endsWith('.xml')) {
                    docType = 'xml';
                }

                setAnalysis(prev => ({
                    ...prev,
                    progressPercentage: 40,
                    steps: { ...prev.steps, ocr: 'completed', categorization: 'processing' }
                }));

                await docRepo.uploadDocument({
                    name: file.name,
                    type: docType,
                    taille: file.size,
                    content: base64Content
                }, token);

                setAnalysis(prev => ({
                    ...prev,
                    progressPercentage: 100,
                    steps: { ocr: 'completed', categorization: 'completed', fiscalImpact: 'processing' }
                }));

                await refreshStats();
            } catch (error) {
                console.error(error);
                setAnalysis(prev => ({ ...prev, fileName: "Erreur lors du traitement" }));
            }
        };
        reader.readAsDataURL(file);
    };

    return {
        stats,
        analysis,
        globalVolume,
        fileInputRef,
        cameraInputRef,
        handleFileSelect: () => fileInputRef.current?.click(),
        handleStartScan: () => cameraInputRef.current?.click(),
        onFileChange: (e: React.ChangeEvent<HTMLInputElement>, isImage: boolean) => {
            const file = e.target.files?.[0];
            if (file) processUpload(file, isImage);
        },
        refreshStats
    };
}