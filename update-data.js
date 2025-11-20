// scripts/update-data.js
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup paths for ES modules (since your package.json uses "type": "module")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.join(__dirname, '../public/matches.json');

const MODEL_NAME = 'gemini-2.5-flash';

async function fetchDailyMatches() {
  console.log("Starting Daily Match Analysis...");
  
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // This prompt is adapted from your original geminiService.ts
    const prompt = `
      Act as a professional football analyst and betting expert.
      Task: Identify exactly 10 of the most interesting/viral football matches happening TODAY worldwide (focus on top 5 European leagues, major international tournaments, or high-profile friendlies).
      
      For each match, perform a deep analysis using Google Search to find:
      1. Recent form (last 5 games).
      2. Head-to-Head (H2H) history.
      3. Key player injuries/suspensions.
      4. Motivation/League standing context.
      5. Viral sentiment (is it a derby? a title decider?).

      Based on this, calculate a percentage probability for Home Win, Draw, and Away Win.
      Suggest a "Safe Bet" (high probability, lower odds) and a "Value Bet" (medium/high risk, better odds).

      Output Requirement:
      Return ONLY a valid JSON array. Do not include markdown code blocks.
      The structure of each object in the array MUST be:
      {
        "id": "string (unique)",
        "time": "string (UTC time, e.g., 20:00)",
        "league": "string",
        "homeTeam": "string",
        "awayTeam": "string",
        "prediction": { "homeWin": number, "draw": number, "awayWin": number }, 
        "safeBet": { "title": "string", "odds": "string", "description": "string" },
        "valueBet": { "title": "string", "odds": "string", "description": "string" },
        "stats": { "homeForm": "string", "awayForm": "string", "h2h": "string", "keyInsights": "string" },
        "reasoning": "string"
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let text = response.text;
    if (!text) throw new Error("No response from Gemini");

    // Clean up markdown if Gemini adds it
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```/, '').replace(/```$/, '');
    }

    // Verify it parses as JSON before saving
    const matches = JSON.parse(cleanText);
    
    if (!Array.isArray(matches) || matches.length === 0) {
        throw new Error("Invalid format: Expected an array of matches");
    }

    // Ensure public directory exists
    const publicDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(publicDir)){
        fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(matches, null, 2));
    console.log(`Successfully wrote ${matches.length} matches to ${OUTPUT_FILE}`);

  } catch (error) {
    console.error("Critical Error in Update Script:", error);
    process.exit(1);
  }
}

fetchDailyMatches();
