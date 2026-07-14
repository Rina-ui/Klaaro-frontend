import { useState, useEffect, useCallback } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from './useAuth.ts';
import { HttpDashboardRepository, type DashboardSummary, type DashboardActivityEntry } from '../../infrastructure/api/HttpDashboardRepository.ts';
import { formatRelativeDate } from '../utils/formatRelativeDate.ts';
import type { StatCard, ActivityItem } from '../../entities/Dashboard.ts';

const dashboardRepo = new HttpDashboardRepository();

function mapActivityToItem(entry: DashboardActivityEntry): ActivityItem {
    switch (entry.kind) {
        case 'alerte':
            return {
                type: 'alerte',
                text: entry.text || 'Alerte',
                sub: entry.sub,
                time: formatRelativeDate(entry.date),
                icon: AlertTriangle,
                color: entry.niveau_gravite === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
            };
        case 'rapport':
            return {
                type: 'rapport',
                text: entry.text || 'Analyse',
                sub: entry.sub,
                time: formatRelativeDate(entry.date),
                icon: entry.sub === 'prediction' ? TrendingUp : BarChart3,
                color: 'bg-emerald-100 text-emerald-700'
            };
        case 'decision':
        default:
            return {
                type: 'decision',
                text: entry.text || 'Décision',
                sub: entry.sub,
                time: formatRelativeDate(entry.date),
                icon: CheckCircle2,
                color: 'bg-blue-100 text-blue-600'
            };
    }
}

export function useDashboardData() {
    const { token } = useAuth();
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            setError(null);
            const data = await dashboardRepo.getSummary(token);
            setSummary(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors du chargement du dashboard.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const topStats: StatCard[] = summary ? [
        { title: "Fichiers uploadés", value: String(summary.uploadedFilesCount) },
        { title: "Analyses réalisées", value: String(summary.analysesCount) },
        { title: "Prédictions", value: String(summary.predictionsCount) },
        { title: "Décisions", value: String(summary.decisionsCount) },
        { title: "Alertes actives", value: String(summary.alertesCount) },
    ] : [];

    const recentActivity: ActivityItem[] = summary?.recentActivity.map(mapActivityToItem) ?? [];

    return { summary, topStats, recentActivity, loading, error, refresh };
}