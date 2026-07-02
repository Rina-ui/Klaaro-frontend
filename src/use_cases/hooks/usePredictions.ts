import { useState } from 'react';
import type {InsightReport, MetricOverview, SummaryMetrics} from "../../entities/PredictionData.ts";


export function usePredictions() {
    const [metrics] = useState<MetricOverview>({
        overviewProgress: 75,
        growthProgress: 40,
        criticalIssues: 38,
        daysSpent: 26,
        overnightWork: 103
    });

    const [insight] = useState<InsightReport>({
        percentage: 12,
        message: "Vos revenus devraient augmenter de le mois prochain grâce à la forte demande saisonnière en produits frais."
    });

    const [summary] = useState<SummaryMetrics>({
        expectedCashFlow: "2.4M",
        expectedOrders: 842,
        breakEvenDate: "18 Mai"
    });

    const handleNewSimulation = () => console.log("Déclenchement d'une nouvelle simulation...");
    const handleViewDetails = () => console.log("Affichage des détails de l'insight...");

    return {
        metrics,
        insight,
        summary,
        handleNewSimulation,
        handleViewDetails
    };
}