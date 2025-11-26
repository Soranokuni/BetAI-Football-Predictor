import { GoogleGenAI } from "@google/genai";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODEL_NAME = 'gemini-2.5-flash-lite';

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
    Act as a professional football analyst and betting expert.
    Current Date: ${today}
    Current Time: ${now} UTC
    
    Task: Identify UP TO 10 valid, confirmed football matches happening TODAY (${today}) that have NOT yet started (start time must be after ${now} UTC).
    
    CRITICAL INSTRUCTION: REALITY > SIGNIFICANCE.
    1. It is better to return 3 REAL matches from a lower league than 10 FAKE matches from the Premier League.
    2. If today is a Thursday, check for Europa League/Conference League.
    3. If today is during an International Break, check for National Team matches (World Cup Qualifiers, Nations League).
    4. If no European matches are on, CHECK GLOBAL LEAGUES:
       - South America: Brasileirão, Argentine Primera, Copa Libertadores/Sudamericana.
       - North America: Liga MX (Mexico), MLS (USA).
       - Asia: Saudi Pro League, J-League, K-League.
       - Africa: CAF Champions League or major domestic leagues.
    5. DO NOT INVENT MATCHES. If Man Utd is not playing today, DO NOT list them.
    
    Verification Steps:
    1. Search for "Football matches today ${today}".
    2. Search specifically for "Liga MX matches today", "Saudi Pro League matches today", "Brasileirão matches today".
    3. Verify the fixture exists on a reputable sports site.
    4. Check for duplicates (Team A vs Team B AND Team A vs Team C is impossible).
    
    Constraints:
    1. EXCLUDE all women's football matches. Men's football only.
    2. PREFER Top European Leagues, but ONLY if they are actually playing today.
    3. IF NO Top European matches, take ANY professional match from the leagues listed above (Liga MX, Saudi, etc.).
    4. Select the most "significant" *available* matches (Title contenders > Mid-table).
    
    For each match, perform a deep analysis using Google Search to find:
    1. CONFIRM the match date, time, and OPPONENT.
    2. Recent form (last 5 games).
    3. Head-to-Head (H2H) history.
    4. Key player injuries/suspensions.
    5. Motivation/League standing context.
    6. Viral sentiment (is it a derby? a title decider?).

    Based on this, calculate a percentage probability for Home Win, Draw, and Away Win.
    Suggest a "Safe Bet" (high probability, lower odds) and a "Value Bet" (medium/high risk, better odds).

    Output Requirement:
    Return ONLY a valid JSON array.
    The structure of each object in the array MUST be:
    {
      "id": "string (unique)",
      "date": "string (YYYY-MM-DD) - MUST BE ${today}",
      "time": "string (UTC time, e.g., 20:00)",
      "league": "string",
      "homeTeam": "string",
      "awayTeam": "string",
      "fixture_verification_url": "string (URL where you confirmed this specific match)",
      "prediction": { "homeWin": number, "draw": number, "awayWin": number }, // Sum to 100
      "safeBet": { "title": "string (e.g. Double Chance 1X)", "odds": "string (e.g. 1.25)", "description": "string" },
      "valueBet": { "title": "string (e.g. Home Win & Over 2.5)", "odds": "string (e.g. 2.80)", "description": "string" },
      "stats": { "homeForm": "string", "awayForm": "string", "h2h": "string", "keyInsights": "string" },
      "reasoning": "string (A concise paragraph explaining the percentages and bets)"
    }
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
          responseMimeType: 'application/json', // Force JSON output
        },
      });

      console.log("Full Response Object:", JSON.stringify(response, null, 2));

      let text;
      // Try getting text from function if available
      if (typeof response.text === 'function') {
        try {
          text = response.text();
        } catch (e) {
          console.log("response.text() failed:", e.message);
        }
      }
      // Try getting text from property
      if (!text && response.text) {
        text = response.text;
      }

      // Fallback: manually extract from candidates
      if (!text && response.candidates && response.candidates.length > 0) {
        const parts = response.candidates[0].content.parts;
        if (parts && parts.length > 0) {
          text = parts.map(p => p.text).join('');
        }
      }

      console.log("Extracted text length:", text ? text.length : 0);

      if (!text) {
        throw new Error("No response text from Gemini");
      }

      // Clean up the response
      let cleanText = text.trim();

      // Remove markdown code blocks if present (even with responseMimeType, sometimes it happens)
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

      // Robust JSON extraction: Find the first JSON array
      const jsonMatch = cleanText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        cleanText = jsonMatch[0];
      } else {
        // Fallback: Try to find just the array brackets if the inner structure check fails
        const firstOpen = cleanText.indexOf('[');
        const lastClose = cleanText.lastIndexOf(']');
        if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
          cleanText = cleanText.substring(firstOpen, lastClose + 1);
        }
      }

      console.log("Text to parse (first 100 chars):", cleanText.substring(0, 100) + "...");

      // Validate JSON
      let matches;
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
