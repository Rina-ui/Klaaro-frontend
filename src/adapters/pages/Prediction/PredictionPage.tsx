import React from 'react';
import { usePredictions } from "../../../use_cases/hooks/usePredictions.ts";
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
        // L'enveloppe doit être "relative" et "overflow-hidden" sans couleur de fond opaque pour voir le Layout en dessous
        <div className="w-full text-[#1a1a1a] font-sans p-4 md:p-8 antialiased flex flex-col items-center min-h-screen relative overflow-hidden">

            {/*BACKGROUND */}
            <div className="absolute top-[-20%] left-[-10%] w-[850px] h-[550px] bg-[#1e5138]/20 rounded-[140px] rotate-[15deg] pointer-events-none z-0 mix-blend-multiply" />

            <div className="absolute top-[-8%] left-[-2%] w-[500px] h-[400px] bg-[#1e5138]/35 rounded-[100px] rotate-[8deg] pointer-events-none z-0 mix-blend-multiply" />

            <div className="absolute top-[35%] right-[-12%] w-[700px] h-[500px] bg-[#1e5138]/15 rounded-[120px] rotate-[-20deg] pointer-events-none z-0 mix-blend-multiply" />

            {/* Tout ton contenu passe en z-10 pour flotter au-dessus de cette nouvelle disposition */}
            <div className="w-full max-w-[1300px] flex flex-col relative z-10">

                <NavigationTabs />

                <MetricGauges metrics={metrics} />

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