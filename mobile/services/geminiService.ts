import { Match } from '../types';

const BASE_URL = 'https://Soranokuni.github.io/BetAI-Football-Predictor/';

export const fetchDailyMatches = async (): Promise<Match[]> => {
    try {
        const response = await fetch(`${BASE_URL}matches.json?t=${new Date().getTime()}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch matches: ${response.statusText}`);
        }

        const matches: Match[] = await response.json();

        // Basic validation
        if (!Array.isArray(matches)) {
            throw new Error("Invalid format: Expected an array of matches");
        }

        return matches;

    } catch (error) {
        console.error("Error fetching daily matches:", error);
        throw error;
    }
};
