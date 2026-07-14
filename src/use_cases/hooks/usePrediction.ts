import { useState, useCallback } from 'react';
import { useAuth } from './useAuth.ts';
import type { SummaryMetrics, MetricOverview, InsightReport } from '../../entities/PredictionData.ts';

// 1. Définition des types pour la réponse du backend FastAPI
interface BackendDataPoint {
    date: string;
    valeur: number;
}

interface BackendMetrics {
    accuracy?: number;
    mae?: number;
    rmse?: number;
}

interface BackendPredictionResponse {
    historique?: BackendDataPoint[];
    predictions?: BackendDataPoint[];
    metrics?: BackendMetrics;
    detail?: string;
}

// 2. Type pour les structures d'objets attendues par Recharts
interface ChartDataPoint {
    date: string;
    Historique: number | null;
    Prevision: number | null;
}

export function usePredictions() {
    const { token } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Gélules et Compteurs (MetricGauges)
    const [metrics, setMetrics] = useState<MetricOverview>({
        overviewProgress: 0,
        growthProgress: 0,
        criticalIssues: 0,
        daysSpent: 0,
        overnightWork: 0
    });

    // 2. Carte d'analyse intelligente (InsightCard) - NETTOYÉ ICI
    const [insight, setInsight] = useState<InsightReport>({
        percentage: 0
    });

    // 3. Résumé financier du bas (SummaryCards)
    const [summary, setSummary] = useState<SummaryMetrics>({
        expectedCashFlow: "0",
        expectedOrders: 0,
        breakEvenDate: "Calcul en cours..."
    });

    // 4. Points de données pour Recharts (PredictionChart)
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

    const executePrediction = useCallback(async (file: File, targetCol: string = "ventes", nDays: number = 30) => {
        if (!token) return;
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`http://localhost:8000/ml/predict?target_col=${targetCol}&n_days=${nDays}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data: BackendPredictionResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Erreur lors du calcul algorithmique.");
            }

            // === A. FORMATAGE DU GRAPHIQUE (Historique vs Prévision) ===
            const histPoints: ChartDataPoint[] = (data.historique || []).map((pt: BackendDataPoint) => ({
                date: pt.date,
                Historique: pt.valeur,
                Prevision: null
            }));

            const lastHistPoint = histPoints[histPoints.length - 1];

            const predPoints: ChartDataPoint[] = (data.predictions || []).map((pt: BackendDataPoint, idx: number) => ({
                date: pt.date,
                Historique: idx === 0 && lastHistPoint ? lastHistPoint.Historique : null,
                Prevision: pt.valeur
            }));

            setChartData([...histPoints, ...predPoints]);

            // === B. CALCUL ET INJECTION DANS TES COMPOSANTS UI ===

            const totalPrevisions = data.predictions?.reduce((sum: number, p: BackendDataPoint) => sum + p.valeur, 0) || 0;
            const avgPrevisionValue = data.predictions?.length ? (totalPrevisions / data.predictions.length) : 0;

            const totalHistorique = data.historique?.reduce((sum: number, p: BackendDataPoint) => sum + p.valeur, 0) || 0;
            const avgHistValue = data.historique?.length ? (totalHistorique / data.historique.length) : 1;

            const computedGrowth = ((avgPrevisionValue - avgHistValue) / avgHistValue) * 100;
            const absoluteGrowthPercent = Math.abs(parseFloat(computedGrowth.toFixed(1)));

            // Mise à jour de MetricGauges
            setMetrics({
                overviewProgress: data.metrics?.accuracy || 92,
                growthProgress: Math.min(Math.max(Math.round(absoluteGrowthPercent), 10), 100),
                criticalIssues: data.metrics?.mae ? Math.round(data.metrics.mae / 10) : 2,
                daysSpent: nDays,
                overnightWork: Math.round((data.metrics?.rmse || 15) / 5)
            });

            // Mise à jour de l'InsightCard - NETTOYÉ ICI
            setInsight({
                percentage: absoluteGrowthPercent
            });

            // Mise à jour des SummaryCards (Bas de page)
            setSummary({
                expectedCashFlow: Math.round(totalPrevisions).toLocaleString('fr-FR'),
                expectedOrders: Math.round((data.predictions?.length || 1) * 3.5),
                breakEvenDate: data.predictions?.[Math.floor(data.predictions.length / 2)]?.date || "Fin de mois"
            });

        } catch (err: unknown) {
            console.error("Erreur Predictions :", err);
            const errorMessage = err instanceof Error ? err.message : "Impossible de générer les prévisions avec l'API.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const handleNewSimulation = () => {
        setChartData([]);
        setMetrics({ overviewProgress: 0, growthProgress: 0, criticalIssues: 0, daysSpent: 0, overnightWork: 0 });
        setSummary({ expectedCashFlow: "0", expectedOrders: 0, breakEvenDate: "Calcul en cours..." });
    };

    const handleViewDetails = () => {
        alert(`Détails du Modèle :\nStatut: Connecté\nTarget: Variable temporelle adaptative\nServeur: FastAPI Engine`);
    };

    return {
        metrics,
        insight,
        summary,
        chartData,
        loading,
        error,
        executePrediction,
        handleNewSimulation,
        handleViewDetails
    };
}