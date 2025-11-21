export interface Prediction {
    homeWin: number;
    draw: number;
    awayWin: number;
}

export interface BetOption {
    title: string;
    odds: string; // Approximate odds
    description: string;
}

export interface MatchStats {
    homeForm: string;
    awayForm: string;
    h2h: string;
    keyInsights: string;
}

export interface Match {
    id: string;
    time: string;
    league: string;
    homeTeam: string;
    awayTeam: string;
    prediction: Prediction;
    safeBet: BetOption;
    valueBet: BetOption;
    stats: MatchStats;
    reasoning: string; // Full AI reasoning
}

export enum AppState {
    LOADING,
    ERROR,
    SUCCESS
}

export enum AdStage {
    TIER_1 = 0, // First 3 matches
    TIER_2 = 1, // Next 3 matches
    FULL_ACCESS = 2 // All matches
}
