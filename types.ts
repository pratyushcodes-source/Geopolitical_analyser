export interface AnalysisResponseData {
  eventSummary: string;
  geopoliticalSignificance: string;
  keyActors: string;
  futureImplications: string;
  overallSentiment: 'Positive' | 'Negative' | 'Neutral' | string; // Allow string for flexibility
  keyThemes: string[];
}

export interface AnalysisResult {
  structuredAnalysis: AnalysisResponseData;
  fullAnalysisText: string; // This will be a formatted string combining the structured parts for display
}

export interface Source {
  uri: string;
  title: string;
}

// Used to structure the grounding chunks from Gemini API
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  // Other types of grounding chunks could be defined here if needed
}

export interface HistoryItem {
  id: string; // Unique ID, e.g., timestamp
  country: string;
  timePeriod: string;
  timestamp: number; // Date.now()
  analysis: AnalysisResponseData;
  sources: Source[];
  fullAnalysisText: string; // Storing the formatted text for easy reload
}