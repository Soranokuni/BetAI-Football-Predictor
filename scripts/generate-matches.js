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
    You are a professional sports data analyst.
    Current Date: ${today}
    Current Time: ${now} UTC
    
    GOAL: Find valid, confirmed football matches scheduled for TODAY (${today}) that have NOT started yet.
    
    INSTRUCTIONS:
    1.  **SEARCH**: Use the Google Search tool to find "football matches today ${today}". Look for major leagues (Premier League, La Liga, Serie A, Bundesliga, Ligue 1) first. If none, look for other active leagues (Brasileirão, Liga MX, Saudi Pro League, AFC Champions League, etc.).
    2.  **VERIFY**: Ensure the matches are actually happening TODAY and have not started (Time > ${now} UTC).
    3.  **ANALYZE**: For each confirmed match, find recent form (last 5 games) and head-to-head stats.
    4.  **OUTPUT**: Generate a JSON array containing the match details.

    CONSTRAINTS:
    -   Return ONLY a valid JSON array.
    -   Do not include markdown formatting (like \`\`\`json).
    -   Do not include any conversational text.
    -   If no matches are found, return an empty array [].

    JSON STRUCTURE (Strictly follow this):
    [
      {
        "id": "unique_id_string",
        "date": "${today}",
        "time": "HH:MM (UTC)",
        "league": "League Name",
        "homeTeam": "Home Team",
        "awayTeam": "Away Team",
        "fixture_verification_url": "URL of the source",
        "prediction": { "homeWin": 40, "draw": 30, "awayWin": 30 },
        "safeBet": { "title": "Bet Name", "odds": "Decimal", "description": "Reason" },
        "valueBet": { "title": "Bet Name", "odds": "Decimal", "description": "Reason" },
        "stats": { "homeForm": "W-L-D-W-W", "awayForm": "L-L-D-W-L", "h2h": "Home won last 2", "keyInsights": "Key player injured" },
        "reasoning": "Brief analysis of the match."
      }
    ]
  `;

  const maxRetries = 5;
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

      console.log("Full Response Object:", JSON.stringify(response, null, 2));

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
