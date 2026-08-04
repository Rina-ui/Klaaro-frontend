import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth.ts';
import { HttpRapportRepository } from '../../infrastructure/api/HttpRapportRepository.ts';
import type { SummaryMetrics, MetricOverview, InsightReport } from '../../entities/PredictionData.ts';
import {API_BASE_URL} from "../../config/api.ts";

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

// Typer explicitement l'objet prediction reçu
interface BackendPredictionDetails {
    status?: string;
    target_column?: string;
    horizon_jours?: number;
    historique?: BackendDataPoint[];
    predictions?: BackendDataPoint[];
    metrics?: BackendMetrics;
}

interface BackendExplainResponse {
    status: string;
    explanation?: string;
    predictions?: BackendPredictionDetails;
    detail?: string;
}

interface ChartDataPoint {
    date: string;
    Historique: number | null;
    Prevision: number | null;
}

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

    const [metrics, setMetrics] = useState<MetricOverview>(emptyMetrics);
    const [insight, setInsight] = useState<InsightReport>(emptyInsight);
    const [summary, setSummary] = useState<SummaryMetrics>(emptySummary);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [lastGeneratedAt, setLastGeneratedAt] = useState<string | null>(null);

    const resetState = useCallback(() => {
        setMetrics(emptyMetrics);
        setInsight(emptyInsight);
        setSummary(emptySummary);
        setChartData([]);
        setLastGeneratedAt(null);
    }, []);

    // Récupération du dernier rapport
    const loadLatestPrediction = useCallback(async () => {
        if (!user?.id || !token) {
            resetState();
            return;
        }

        try {
            // Correction TS2554 : passage de 2 arguments (adapter au besoin selon la méthode exacte de ton repository)
            const latest = await rapportRepo.getLatestRapportByType(token, 'prediction');
            if (latest && latest.content && latest.content.trim() !== "") {
                const stored = JSON.parse(latest.content) as StoredPredictionState;
                setMetrics(stored.metrics || emptyMetrics);
                setInsight(stored.insight || emptyInsight);
                setSummary(stored.summary || emptySummary);
                setChartData(stored.chartData || []);
                setLastGeneratedAt(stored.generatedAt || null);
            } else {
                resetState();
            }
        } catch (err) {
            console.error("Impossible de recharger la dernière prédiction depuis le backend :", err);
            resetState();
        }
    }, [user?.id, token, resetState]);

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

            const response = await fetch(`${API_BASE_URL}/ml/explain?target_col=${encodeURIComponent(targetCol)}&n_days=${nDays}`, {
                method: 'POST',
                body: formData,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data: BackendExplainResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Erreur lors du calcul et de l'explication.");
            }

            // Correction TS2339 : Extraction sécurisée avec le type BackendPredictionDetails
            const predRes: BackendPredictionDetails = data.predictions || {};
            const historique: BackendDataPoint[] = predRes.historique || [];
            const predictions: BackendDataPoint[] = predRes.predictions || [];

            // 1. Construction du graphique
            const histPoints: ChartDataPoint[] = historique.map((pt: BackendDataPoint) => ({
                date: pt.date,
                Historique: pt.valeur,
                Prevision: null
            }));

            const lastHistPoint = histPoints[histPoints.length - 1];

            const predPoints: ChartDataPoint[] = predictions.map((pt: BackendDataPoint, idx: number) => ({
                date: pt.date,
                Historique: idx === 0 && lastHistPoint ? lastHistPoint.Historique : null,
                Prevision: pt.valeur
            }));

            const newChartData = [...histPoints, ...predPoints];

            // 2. Calculs
            const totalPrevisions = predictions.reduce((sum: number, p: BackendDataPoint) => sum + p.valeur, 0);
            const avgPrevisionValue = predictions.length ? (totalPrevisions / predictions.length) : 0;

            const totalHistorique = historique.reduce((sum: number, p: BackendDataPoint) => sum + p.valeur, 0);
            const avgHistValue = historique.length ? (totalHistorique / historique.length) : 1;

            const computedGrowth = ((avgPrevisionValue - avgHistValue) / avgHistValue) * 100;
            const absoluteGrowthPercent = Math.abs(parseFloat(computedGrowth.toFixed(1)));

            const newMetrics: MetricOverview = {
                overviewProgress: predRes.metrics?.accuracy || 92,
                growthProgress: Math.min(Math.max(Math.round(absoluteGrowthPercent), 10), 100),
                criticalIssues: predRes.metrics?.mae ? Math.round(predRes.metrics.mae / 10) : 2,
                daysSpent: nDays,
                overnightWork: Math.round((predRes.metrics?.rmse || 15) / 5)
            };

            const newInsight: InsightReport = {
                percentage: absoluteGrowthPercent,
                message: data.explanation || `La colonne "${targetCol}" devrait évoluer de ${absoluteGrowthPercent}% sur les ${nDays} prochains jours.`
            };

            const newSummary: SummaryMetrics = {
                expectedCashFlow: Math.round(totalPrevisions).toLocaleString('fr-FR'),
                expectedOrders: Math.round((predictions.length || 1) * 3.5),
                breakEvenDate: predictions[Math.floor(predictions.length / 2)]?.date || "Fin de mois"
            };

            const generatedAt = new Date().toISOString();

            setChartData(newChartData);
            setMetrics(newMetrics);
            setInsight(newInsight);
            setSummary(newSummary);
            setLastGeneratedAt(generatedAt);

            await persistPrediction({
                metrics: newMetrics,
                insight: newInsight,
                summary: newSummary,
                chartData: newChartData,
                generatedAt
            });

        } catch (err: unknown) {
            console.error("Erreur Predictions & Explication :", err);
            const errorMessage = err instanceof Error ? err.message : "Impossible de générer les explications avec l'API.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const handleNewSimulation = useCallback(() => {
        resetState();
    }, [resetState]);

    const handleViewDetails = () => {
        alert(`Détails du Modèle KLAARO :\nStatut: Connecté\nModèle de synthèse: Ollama (Llama 3.2)\nTraitement ML: FastAPI Engine`);
    };

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