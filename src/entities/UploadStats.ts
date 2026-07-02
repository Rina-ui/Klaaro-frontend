export interface UploadStats {
    uploadedFilesCount: number;
    uploadedFilesTrend: number;
    databaseConnectionsCount: number;
    scannedPhotosCount: number;
    scannedPhotosMax: number;
}

export interface AnalysisStatus {
    fileName: string;
    fileSize: string;
    progressPercentage: number;
    steps: {
        ocr: 'completed' | 'pending' | 'processing';
        categorization: 'completed' | 'pending' | 'processing';
        fiscalImpact: 'completed' | 'pending' | 'processing';
    };
}

// Fonction métier (Pure Pure domain logic)
export function calculateGlobalVolume(stats: UploadStats): number {
    return stats.uploadedFilesCount + stats.databaseConnectionsCount + stats.scannedPhotosCount;
}