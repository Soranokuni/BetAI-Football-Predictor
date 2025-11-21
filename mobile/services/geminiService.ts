import { Match } from '../types';

const BASE_URL = 'https://Soranokuni.github.io/BetAI-Football-Predictor/';

let matchesCache: Match[] | null = null;

export const fetchDailyMatches = async (forceRefresh = false): Promise<Match[]> => {
    if (matchesCache && !forceRefresh) {
        return matchesCache;
    }

    try {
        const response = await fetch(`${BASE_URL}matches.json?t=${new Date().getTime()}`, {
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch matches: ${response.statusText}`);
        }

        const matches: Match[] = await response.json();

        // Basic validation
        if (!Array.isArray(matches)) {
            throw new Error("Invalid format: Expected an array of matches");
        }

        matchesCache = matches;
        return matches;

    } catch (error) {
        console.error("Error fetching daily matches:", error);
        throw error;
    }
};

export const getMatchById = async (id: string): Promise<Match | undefined> => {
    if (!matchesCache) {
        await fetchDailyMatches();
    }
    return matchesCache?.find(m => m.id === id);
};
