import { useState, useEffect, useRef } from "react";
import { useAuth } from "./useAuth.ts";
import { HttpDocumentRepository } from "../../infrastructure/api/HttpDocumentRepository.ts";
import type {UploadStats} from "../../entities/UploadStats.ts";

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

    const refreshStats = async () => {
        if (user?.id && token) {
            try {
                const data = await docRepo.getStatsByUserId(user.id, token);
                setStats(data);
            } catch (err) {
                console.error(err);
            }
        }
    };

    useEffect(() => { refreshStats(); }, [user?.id, token]);

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

                let docType = 'json';
                if (isImage) docType = 'image';
                else if (file.name.endsWith('.csv')) docType = 'csv';
                else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) docType = 'excel';
                else if (file.name.endsWith('.pdf')) docType = 'pdf';

                setAnalysis(prev => ({ ...prev, progressPercentage: 40, steps: { ...prev.steps, ocr: 'completed', categorization: 'processing' } }));

                await docRepo.uploadDocument({
                    name: file.name,
                    type: docType as any,
                    taille: file.size,
                    content: base64Content,
                    user_id: user.id
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