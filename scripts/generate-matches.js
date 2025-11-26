import { GoogleGenAI } from "@google/genai";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODEL_NAME = 'gemini-2.5-flash';

async function generateMatches() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY environment variable not found");
    process.exit(1);
  }

  console.log("Initializing Gemini...");
  const ai = new GoogleGenAI({ apiKey });

  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString().split('T')[1].substring(0, 5); // HH:MM
  console.log(`Generating matches for date: ${today}, current time: ${now} UTC`);

  const prompt = `
    You are a World-Class Football Bet Builder & Analyst.
    Current Date: ${today}
    Current Time: ${now} UTC
    
    GOAL: Identify the best football betting opportunities for TODAY (${today}) by finding confirmed matches and providing deep, data-driven analysis.
    
    WORKFLOW:
    1.  **DISCOVER**: Use Google Search to find ALL professional football matches scheduled for TODAY.
        -   Priority: Champions League, Europa League, Top 5 European Leagues (Premier League, La Liga, etc.).
        -   Secondary: Major Global Leagues (Brasileirão, Liga MX, MLS, Saudi Pro League, J-League).
        -   Note: If it's a quiet day, find the best available professional matches from lower tiers or smaller nations.
    2.  **VALIDATE**: Confirm the match is definitely happening TODAY and hasn't started yet (Time > ${now} UTC).
    3.  **DEEP DIVE**: For each match, analyze:
        -   **Form**: Last 5 matches for both teams.
        -   **H2H**: Recent head-to-head history.
        -   **Context**: Injuries, suspensions, motivation (title race vs relegation), home/away advantage.
    4.  **RECOMMEND**: Create a "Safe Bet" and a "Value Bet" based on your analysis. Explain *WHY* the user should take these bets.
    
    OUTPUT FORMAT:
    Return ONLY a valid JSON array. No markdown, no intro/outro text.
    
    JSON STRUCTURE:
    [
      {
        "id": "team_a_vs_team_b_date",
        "date": "${today}",
        "time": "HH:MM (UTC)",
        "league": "League Name",
        "homeTeam": "Home Team",
        "awayTeam": "Away Team",
        "fixture_verification_url": "URL",
        "prediction": { "homeWin": 45, "draw": 25, "awayWin": 30 },
        "safeBet": { 
          "title": "e.g., Home Win or Draw", 
          "odds": "e.g., 1.30", 
          "description": "Detailed reason why this is safe (e.g., 'Home team unbeaten in 10 games at home...')" 
        },
        "valueBet": { 
          "title": "e.g., Home Win & BTTS", 
          "odds": "e.g., 3.50", 
          "description": "Detailed reason for the value (e.g., 'Away team scores often but leaks goals...')" 
        },
        "stats": { 
          "homeForm": "W-D-W-W-L", 
          "awayForm": "L-L-D-L-W", 
          "h2h": "Home team won last 3 meetings", 
          "keyInsights": "Top scorer returning from injury; Away team has defensive crisis." 
        },
        "reasoning": "A professional, persuasive paragraph summarizing the match analysis and justifying the recommended bets. Act like a betting pro giving advice to a client."
      }
    ]
  `;

  const maxRetries = 7;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      console.log(`Generating content (Attempt ${retryCount + 1}/${maxRetries})...`);
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      // console.log("Full Response Object:", JSON.stringify(response, null, 2)); // Commented out to reduce noise

      let text;
      if (typeof response.text === 'function') {
        try { text = response.text(); } catch (e) { console.log("response.text() failed:", e.message); }
      }
      if (!text && response.text) text = response.text;
      if (!text && response.candidates && response.candidates.length > 0) {
        const parts = response.candidates[0].content.parts;
        if (parts && parts.length > 0) text = parts.map(p => p.text).join('');
      }

      console.log("Extracted text length:", text ? text.length : 0);

      if (!text) throw new Error("No response text from Gemini");

      let cleanText = text.trim();
      // Remove markdown code blocks
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

      // Robust JSON extraction: Find the first JSON array
      const jsonMatch = cleanText.match(/\[\s*\{[\s\S]*\}\s*\]/);

      if (jsonMatch) {
        cleanText = jsonMatch[0];
      } else {
        // If no JSON array found, check if it's a refusal or error
        console.error("No JSON array found in response. Raw text:", cleanText);
        throw new Error("Model did not return a JSON array. It might have refused the request.");
      }
      try {
        matches = JSON.parse(cleanText);
      } catch (e) {
        console.error("JSON Parse Error. Full content was:\n", cleanText);
        throw e;
      }

      if (!Array.isArray(matches) || matches.length === 0) {
        // Sometimes it returns an object with a key like "matches": []
        if (matches && Array.isArray(matches.matches)) {
          matches = matches.matches;
        } else {
          throw new Error("Invalid format: Expected an array of matches");
        }
      }

      // Filter out duplicates and invalid dates
      const seenTeams = new Set();
      const validMatches = [];

      for (const match of matches) {
        // Check date
        if (match.date !== today) {
          console.warn(`Skipping match ${match.homeTeam} vs ${match.awayTeam}: Incorrect date ${match.date}`);
          continue;
        }

        // Check duplicates
        if (seenTeams.has(match.homeTeam) || seenTeams.has(match.awayTeam)) {
          console.warn(`Skipping match ${match.homeTeam} vs ${match.awayTeam}: Team already listed`);
          continue;
        }

        seenTeams.add(match.homeTeam);
        seenTeams.add(match.awayTeam);
        validMatches.push(match);
      }

      console.log(`Successfully generated ${matches.length} raw matches.`);
      console.log(`Filtered to ${validMatches.length} valid unique matches.`);

      if (validMatches.length === 0) {
        throw new Error("No valid matches found after filtering");
      }

      // Ensure public directory exists
      const publicDir = path.join(__dirname, '../public');
      try {
        await fs.access(publicDir);
      } catch {
        await fs.mkdir(publicDir, { recursive: true });
      }

      // Write to file
      const outputPath = path.join(publicDir, 'matches.json');
      await fs.writeFile(outputPath, JSON.stringify(validMatches, null, 2));
      console.log(`Matches saved to ${outputPath}`);
      return; // Success, exit function

    } catch (error) {
      console.error(`Error generating matches (Attempt ${retryCount + 1}):`, error.message);

      const isRetryable =
        error.status === 503 ||
        (error.message && error.message.includes('503')) ||
        error.message === "No response text from Gemini" ||
        error instanceof SyntaxError || // Retry on JSON parse errors
        error.message.includes("JSON"); // Retry on other JSON errors

      if (isRetryable) {
        console.log("Transient error, retrying in 5 seconds...");
        await new Promise(resolve => setTimeout(resolve, 5000));
        retryCount++;
      } else {
        process.exit(1);
      }
    }
  }

  console.error("Max retries reached. Failed to generate matches.");
  process.exit(1);
}

generateMatches();
