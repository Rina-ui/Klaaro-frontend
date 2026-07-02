import React from 'react';
import {usePredictions} from "../../../use_cases/hooks/usePredictions.ts";
import MetricGauges from "./MetricGauges.tsx";
import PredictionChart from "./PredictionChart.tsx";
import InsightCard from "./InsightCard.tsx";
import SummaryCards from "./SummaryCards.tsx";
import NavigationTabs from "../../components/ui/NavigationTabs.tsx";


export default function PredictionsPage(): React.JSX.Element {
    const {
        metrics,
        insight,
        summary,
        handleNewSimulation,
        handleViewDetails
    } = usePredictions();

    return (
        <div className="min-h-screen bg-[#e2e4e3] text-[#1a1a1a] font-sans p-4 md:p-8 antialiased flex flex-col items-center">
            <div className="w-full max-w-[1300px] flex flex-col">

                {/* 1. Onglets de Navigation */}
                <NavigationTabs />

                {/* 2. Top Row (Gauges de progression & compteurs critiques) */}
                <MetricGauges metrics={metrics} />

                {/* 3. Coeur de la page : Graphique & Insight IA */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6 w-full">
                    <PredictionChart />
                    <InsightCard
                        insight={insight}
                        onNewSimulation={handleNewSimulation}
                        onViewDetails={handleViewDetails}
                    />
                </div>

                {/* 4. Résumé financier du bas */}
                <SummaryCards summary={summary} />

            </div>
        </div>
    );
}