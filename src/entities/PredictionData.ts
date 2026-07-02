export interface MetricOverview {
    overviewProgress: number;
    growthProgress: number;
    criticalIssues: number;
    daysSpent: number;
    overnightWork: number;
}

export interface InsightReport {
    percentage: number;
    message: string;
}

export interface SummaryMetrics {
    expectedCashFlow: string;
    expectedOrders: number;
    breakEvenDate: string;
}