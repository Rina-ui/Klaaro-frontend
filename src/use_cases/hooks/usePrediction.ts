import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth.ts';
import { HttpRapportRepository } from '../../infrastructure/api/HttpRapportRepository.ts';
import type { SummaryMetrics, MetricOverview, InsightReport } from '../../entities/PredictionData.ts';

const rapportRepo = new HttpRapportRepository();

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

interface ChartDataPoint {
    date: string;
    Historique: number | null;
    Prevision: number | null;
}

// Format sauvegardé en base (Rapport de type "prediction")
interface StoredPredictionState {
    metrics: MetricOverview;
    insight: InsightReport;
    summary: SummaryMetrics;
    chartData: ChartDataPoint[];
    generatedAt: string;
}

const emptyMetrics: MetricOverview = { overviewProgress: 0, growthProgress: 0, criticalIssues: 0, daysSpent: 0, overnightWork: 0 };
const emptyInsight: InsightReport = { percentage: 0, message: "" };
const emptySummary: SummaryMetrics = { expectedCashFlow: "0", expectedOrders: 0, breakEvenDate: "Calcul en cours..." };

export function usePredictions() {
    const { token, user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ ÉTATS REACT PURS (Remplacement complet de useLocalStorageState)
    const [metrics, setMetrics] = useState<MetricOverview>(emptyMetrics);
    const [insight, setInsight] = useState<InsightReport>(emptyInsight);
    const [summary, setSummary] = useState<SummaryMetrics>(emptySummary);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [lastGeneratedAt, setLastGeneratedAt] = useState<string | null>(null);

    // ✅ Récupère la dernière prédiction sauvegardée en base pour l'utilisateur actuellement connecté
    const loadLatestPrediction = useCallback(async () => {
        if (!user?.id || !token) {
            // Reinitialisation des états si non connecté
            setMetrics(emptyMetrics);
            setInsight(emptyInsight);
            setSummary(emptySummary);
            setChartData([]);
            setLastGeneratedAt(null);
            return;
        }

        try {
            const latest = await rapportRepo.getLatestRapportByType(token, user.id, 'prediction');
            if (latest && latest.content && latest.content.trim() !== "") {
                const stored = JSON.parse(latest.content) as StoredPredictionState;
                setMetrics(stored.metrics || emptyMetrics);
                setInsight(stored.insight || emptyInsight);
                setSummary(stored.summary || emptySummary);
                setChartData(stored.chartData || []);
                setLastGeneratedAt(stored.generatedAt || null);
            } else {
                // Aucun historique trouvé pour cet utilisateur
                setMetrics(emptyMetrics);
                setInsight(emptyInsight);
                setSummary(emptySummary);
                setChartData([]);
                setLastGeneratedAt(null);
            }
        } catch (err) {
            console.error("Impossible de recharger la dernière prédiction depuis le backend :", err);
            setMetrics(emptyMetrics);
            setInsight(emptyInsight);
            setSummary(emptySummary);
            setChartData([]);
            setLastGeneratedAt(null);
        }
    }, [user?.id, token]);

    useEffect(() => {
        loadLatestPrediction();
    }, [loadLatestPrediction]);

    const persistPrediction = async (state: StoredPredictionState) => {
        if (!token) return;
        try {
            await rapportRepo.createRapport({
                type: 'prediction',
                content: JSON.stringify(state),
                periode: state.generatedAt
            }, token);
        } catch (err) {
            console.error("Échec de la sauvegarde de la prédiction en base :", err);
        }
    };

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
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data: BackendPredictionResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Erreur lors du calcul algorithmique.");
            }

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

            const newChartData = [...histPoints, ...predPoints];

            const totalPrevisions = data.predictions?.reduce((sum: number, p: BackendDataPoint) => sum + p.valeur, 0) || 0;
            const avgPrevisionValue = data.predictions?.length ? (totalPrevisions / data.predictions.length) : 0;

            const totalHistorique = data.historique?.reduce((sum: number, p: BackendDataPoint) => sum + p.valeur, 0) || 0;
            const avgHistValue = data.historique?.length ? (totalHistorique / data.historique.length) : 1;

            const computedGrowth = ((avgPrevisionValue - avgHistValue) / avgHistValue) * 100;
            const absoluteGrowthPercent = Math.abs(parseFloat(computedGrowth.toFixed(1)));

            const newMetrics: MetricOverview = {
                overviewProgress: data.metrics?.accuracy || 92,
                growthProgress: Math.min(Math.max(Math.round(absoluteGrowthPercent), 10), 100),
                criticalIssues: data.metrics?.mae ? Math.round(data.metrics.mae / 10) : 2,
                daysSpent: nDays,
                overnightWork: Math.round((data.metrics?.rmse || 15) / 5)
            };

            const newInsight: InsightReport = {
                percentage: absoluteGrowthPercent,
                message: `La colonne "${targetCol}" devrait évoluer de ${absoluteGrowthPercent}% sur les ${nDays} prochains jours, selon la prédiction générée.`
            };

            const newSummary: SummaryMetrics = {
                expectedCashFlow: Math.round(totalPrevisions).toLocaleString('fr-FR'),
                expectedOrders: Math.round((data.predictions?.length || 1) * 3.5),
                breakEvenDate: data.predictions?.[Math.floor(data.predictions.length / 2)]?.date || "Fin de mois"
            };

            const generatedAt = new Date().toISOString();

            setChartData(newChartData);
            setMetrics(newMetrics);
            setInsight(newInsight);
            setSummary(newSummary);
            setLastGeneratedAt(generatedAt);

            // Sauvegarde en base PostgreSQL rattachée au compte utilisateur
            await persistPrediction({
                metrics: newMetrics,
                insight: newInsight,
                summary: newSummary,
                chartData: newChartData,
                generatedAt
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
        setMetrics(emptyMetrics);
        setSummary(emptySummary);
        setInsight(emptyInsight);
        setLastGeneratedAt(null);
    };

    const handleViewDetails = () => {
        alert(`Détails du Modèle :\nStatut: Connecté\nTarget: Variable temporelle adaptative\nServeur: FastAPI Engine`);
    };

    // Recharge un rapport de type "prediction" choisi dans l'historique
    const loadRapport = (content: string) => {
        try {
            const stored = JSON.parse(content) as StoredPredictionState;
            setMetrics(stored.metrics);
            setInsight(stored.insight);
            setSummary(stored.summary);
            setChartData(stored.chartData);
            setLastGeneratedAt(stored.generatedAt);
        } catch (err) {
            console.error("Rapport de prédiction illisible :", err);
        }
    };

    return {
        metrics,
        insight,
        summary,
        chartData,
        loading,
        error,
        lastGeneratedAt,
        executePrediction,
        handleNewSimulation,
        handleViewDetails,
        loadRapport
    };
}