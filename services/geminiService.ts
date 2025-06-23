import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';
import type { Source, GroundingChunk, AnalysisResponseData } from '../types';

const apiKey = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const analyzeGeopoliticalEvents = async (
  country: string,
  timePeriod: string
): Promise<{ analysis: AnalysisResponseData; sources: Source[]; fullText: string }> => {
  if (!ai) {
    console.error("API_KEY is not configured. Please set the environment variable.");
    throw new Error(
      "The Geopolitical Analyzer is not configured correctly. API key is missing."
    );
  }

  const prompt = `
You are a geopolitical analyst.
For the country: "${country}"
And the time period: "${timePeriod}" (e.g., "the last month", "recent weeks", "January 2024")

Your task is to provide a structured analysis in JSON format. The JSON object should have the following keys:
- "eventSummary": Identify and summarize key geopolitical events related to this country during this period. Focus on events with international implications or those that highlight significant domestic shifts affecting its geopolitical stance.
- "geopoliticalSignificance": Analyze the geopolitical significance of these events. Discuss impacts on regional stability, international relations, economic factors, and power dynamics.
- "keyActors": Identify key international and domestic actors involved and their roles or influence concerning these events.
- "futureImplications": Briefly outline potential future implications or trends stemming from these events.
- "overallSentiment": Provide an overall sentiment ('Positive', 'Negative', or 'Neutral') regarding the country's geopolitical situation during this period, based on the identified events.
- "keyThemes": Identify 3-5 key themes or topics that these events revolve around (e.g., 'Economic Stability', 'International Alliances', 'Humanitarian Crisis'). Provide this as an array of strings.

Use Google Search to ensure your information is current and well-grounded.
Ensure the response is detailed, insightful, and strictly adheres to the JSON format described.
Do not include any introductory or concluding text outside the main JSON object.
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
        // Not specifying thinkingConfig, allowing default for higher quality.
        // Removed responseMimeType: "application/json" as it's incompatible with googleSearch tool
      },
    });
    
    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s; // Checks for markdown code fences (e.g., ```json ... ```)
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim(); // Extract content within fences
    }

    let parsedData: AnalysisResponseData;
    try {
      parsedData = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse JSON response:", e, "Raw response text from API:", response.text);
      throw new Error("The API returned an unexpected response format. Could not parse analysis data. The model may not have returned valid JSON.");
    }
    
    // Validate essential fields
    if (!parsedData.eventSummary || !parsedData.geopoliticalSignificance || !parsedData.overallSentiment || !parsedData.keyThemes) {
        console.warn("Parsed data is missing some expected fields:", parsedData);
        // It's possible the model didn't provide all fields, so we might not want to throw an error here,
        // but rather let the UI handle potentially missing data gracefully.
        // For now, we'll keep the error for strictness.
        throw new Error("The API response was incomplete or did not adhere to the requested JSON structure.");
    }


    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    let sources: Source[] = [];
    if (groundingMetadata?.groundingChunks && groundingMetadata.groundingChunks.length > 0) {
      sources = (groundingMetadata.groundingChunks as GroundingChunk[])
        .filter(chunk => chunk.web && chunk.web.uri && chunk.web.uri.trim() !== '')
        .map(chunk => ({
          uri: chunk.web!.uri,
          title: chunk.web!.title || 'Untitled Source',
        }));
    }
    
    // Construct a full text version for simple display if needed, or for copy-to-clipboard
    const fullText = `
**Event Summary:**
${parsedData.eventSummary || 'Not provided.'}

**Geopolitical Significance:**
${parsedData.geopoliticalSignificance || 'Not provided.'}

**Key Actors:**
${parsedData.keyActors || 'Not provided.'}

**Future Implications:**
${parsedData.futureImplications || 'Not provided.'}

**Overall Sentiment:** ${parsedData.overallSentiment || 'N/A'}

**Key Themes:** ${(parsedData.keyThemes && parsedData.keyThemes.length > 0) ? parsedData.keyThemes.join(', ') : 'None identified.'}
    `.trim();

    return { analysis: parsedData, sources, fullText };

  } catch (error) {
    console.error("Error calling Gemini API or processing response:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
         throw new Error("Invalid API Key. Please check your API key configuration.");
    }
    // Check if the error is from the API about unsupported features
    if (error instanceof Error && (error.message.includes("Tool use with a response mime type") || error.message.includes("Request payload is invalid"))) {
        throw new Error("There was a configuration issue with the API request. Please contact support if this persists.");
    }
    throw new Error(
      `Failed to analyze geopolitical events. ${(error as Error).message || "An unexpected API error occurred."}`
    );
  }
};