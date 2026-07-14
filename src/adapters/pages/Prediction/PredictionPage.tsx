import React from 'react';
import { usePredictions } from "../../../use_cases/hooks/usePrediction.ts";
import MetricGauges from "./MetricGauges.tsx";
import PredictionChart from "./PredictionChart.tsx";
import InsightCard from "./InsightCard.tsx";
import SummaryCards from "./SummaryCards.tsx";
import NavigationTabs from "../../components/ui/NavigationTabs.tsx";
import PredictionConfigBar from "./PredictionConfigBar.tsx";

export default function PredictionsPage(): React.JSX.Element {
    const {
        metrics,
        insight,
        summary,
        chartData,
        loading,
        error,
        lastGeneratedAt,
        executePrediction,
        handleNewSimulation,
        handleViewDetails
    } = usePredictions();

    return (
        <div className="w-full text-[#1a1a1a] font-sans p-4 md:p-8 antialiased flex flex-col items-center min-h-screen relative overflow-hidden">

            <div className="absolute top-[-20%] left-[-10%] w-[850px] h-[550px] bg-[#1e5138]/20 rounded-[140px] rotate-[15deg] pointer-events-none z-0 mix-blend-multiply" />
            <div className="absolute top-[-8%] left-[-2%] w-[500px] h-[400px] bg-[#1e5138]/35 rounded-[100px] rotate-[8deg] pointer-events-none z-0 mix-blend-multiply" />
            <div className="absolute top-[35%] right-[-12%] w-[700px] h-[500px] bg-[#1e5138]/15 rounded-[120px] rotate-[-20deg] pointer-events-none z-0 mix-blend-multiply" />

            <div className="w-full max-w-[1300px] flex flex-col relative z-10">
                <NavigationTabs />

                <MetricGauges metrics={metrics} />

                <PredictionConfigBar onPredict={executePrediction} loading={loading} />

                {error && (
                    <div className="w-full mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-2xl text-xs font-semibold text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6 w-full">
                    <PredictionChart chartData={chartData} lastGeneratedAt={lastGeneratedAt} />

                    <div className="lg:col-span-3">
                        <InsightCard
                            insight={insight}
                            onNewSimulation={handleNewSimulation}
                            onViewDetails={handleViewDetails}
                        />
                    </div>
                </div>

                <SummaryCards summary={summary} />
            </div>
        </div>
    );
}
