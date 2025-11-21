export interface Match {
    id: string;
    homeTeam: string;
    awayTeam: string;
    league: string;
    date: string;
    time: string;
    prediction: {
        winner: string;
        probability: number;
        score: string;
        reasoning: string;
    };
    viralScore?: number;
}

const DATA_URL = 'https://Soranokuni.github.io/BetAI-Football-Predictor/matches.json';

export async function fetchMatches(): Promise<Match[]> {
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch matches');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching matches:', error);
        return [];
    }
}
