import { CheckCircle2, Cpu, UploadCloud, Database } from 'lucide-react'
import type { StatCard, FileItem, ActivityItem } from '../../entities/Dashboard'

export function useDashboardData() {
    const topStats: StatCard[] = [
        { title: "Fichiers uploadés", value: "48" },
        { title: "Analyses réalisées", value: "173" },
        { title: "Prédictions", value: "820" },
        { title: "Earnings", value: "$682.50" },
    ]

    const recentFiles: FileItem[] = [
        { name: "ventes_2024.csv", size: "2.4 Mo" },
        { name: "clients.xlsx", size: "1.8 Mo" },
        { name: "transactions.sql", size: "3.7 Mo" },
        { name: "marketing_data.csv", size: "5.2 Mo" },
        { name: "rapport_q2.xlsx", size: "4.1 Mo" },
    ]

    const recentActivity: ActivityItem[] = [
        { type: "analysis", text: "Analyse terminée", sub: "ventes_2024.csv", time: "5m", icon: CheckCircle2, color: "text-green-500 bg-green-50" },
        { type: "prediction", text: "Prédiction générée", sub: "Modèle XGBoost", time: "15m", icon: Cpu, color: "text-blue-500 bg-blue-50" },
        { type: "upload", text: "Fichier uploadé", sub: "marketing_data.csv", time: "1h", icon: UploadCloud, color: "text-purple-500 bg-purple-50" },
        { type: "db", text: "Connexion DB réussie", sub: "PostgreSQL", time: "2h", icon: Database, color: "text-emerald-500 bg-emerald-50" },
    ]

    return { topStats, recentFiles, recentActivity }
}