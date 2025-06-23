import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { HistoryPanel } from './components/HistoryPanel'; // New component
import { analyzeGeopoliticalEvents } from './services/geminiService';
import type { AnalysisResult, Source, HistoryItem, AnalysisResponseData } from './types';

const MAX_HISTORY_ITEMS = 20;
const LOCAL_STORAGE_KEY = 'geopoliticalAnalysisHistory';

// Helper to reconstruct full text - can be moved to a utility file later
const reconstructFullText = (analysisData: AnalysisResponseData): string => {
  return `
**Event Summary:**
${analysisData.eventSummary || 'Not provided.'}

**Geopolitical Significance:**
${analysisData.geopoliticalSignificance || 'Not provided.'}

**Key Actors:**
${analysisData.keyActors || 'Not provided.'}

**Future Implications:**
${analysisData.futureImplications || 'Not provided.'}

**Overall Sentiment:** ${analysisData.overallSentiment || 'N/A'}

**Key Themes:** ${(analysisData.keyThemes && analysisData.keyThemes.length > 0) ? analysisData.keyThemes.join(', ') : 'None identified.'}
  `.trim();
};


const App: React.FC = () => {
  const [country, setCountry] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<string>('the last month');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [sources, setSources] = useState<Source[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedHistory) {
        setHistoryItems(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage:", e);
      // Optionally clear corrupted history
      // localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(historyItems));
    } catch (e) {
      console.error("Failed to save history to localStorage:", e);
    }
  }, [historyItems]);

  const saveToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    setHistoryItems(prevHistory => {
      const newHistoryItem: HistoryItem = {
        ...item,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      const updatedHistory = [newHistoryItem, ...prevHistory];
      // Limit history size
      return updatedHistory.slice(0, MAX_HISTORY_ITEMS);
    });
  };

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!country.trim()) {
      setError('Please enter a country name.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setSources(null);

    try {
      const result = await analyzeGeopoliticalEvents(country, timePeriod);
      setAnalysisResult({
        structuredAnalysis: result.analysis,
        fullAnalysisText: result.fullText,
      });
      setSources(result.sources);
      // Save to history
      saveToHistory({
        country,
        timePeriod,
        analysis: result.analysis,
        sources: result.sources,
        fullAnalysisText: result.fullText,
      });

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [country, timePeriod]);

  const handleLoadFromHistory = useCallback((item: HistoryItem) => {
    setCountry(item.country);
    setTimePeriod(item.timePeriod);
    setAnalysisResult({
      structuredAnalysis: item.analysis,
      fullAnalysisText: item.fullAnalysisText || reconstructFullText(item.analysis) // Reconstruct if not stored
    });
    setSources(item.sources);
    setError(null);
    setIsLoading(false); // Ensure loading is off
    setShowHistory(false); // Optionally close history panel after loading
  }, []);

  const handleClearHistory = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all analysis history? This action cannot be undone.")) {
      setHistoryItems([]);
    }
  }, []);
  
  const handleDeleteHistoryItem = useCallback((id: string) => {
    setHistoryItems(prev => prev.filter(item => item.id !== id));
  }, []);


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 selection:bg-teal-500 selection:text-white">
      <Header />
      <main className="w-full max-w-4xl mt-8">
        <InputForm
          country={country}
          setCountry={setCountry}
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        <div className="mt-6 text-center">
            <button
                onClick={() => setShowHistory(prev => !prev)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-teal-300 rounded-md shadow-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-expanded={showHistory}
                aria-controls="history-panel"
            >
                {showHistory ? 'Hide' : 'Show'} Analysis History ({historyItems.length})
            </button>
        </div>

        {showHistory && (
          <HistoryPanel
            historyItems={historyItems}
            onLoadItem={handleLoadFromHistory}
            onClearHistory={handleClearHistory}
            onDeleteItem={handleDeleteHistoryItem}
          />
        )}

        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {analysisResult && !isLoading && (
          <ResultsDisplay 
            analysisResult={analysisResult} 
            sources={sources} 
          />
        )}
        {!isLoading && !error && !analysisResult && !showHistory && (
            <div className="mt-12 text-center text-gray-500">
                <p className="text-xl">Enter a country and time period to begin analysis.</p>
                <p className="mt-2">Example: Country "Germany", Time Period "last 2 weeks".</p>
            </div>
        )}
      </main>
      <footer className="w-full max-w-4xl mt-12 py-6 text-center text-gray-500 border-t border-gray-700">
        <p>Geopolitical Event Analyzer &copy; {new Date().getFullYear()}</p>
        <p className="text-sm mt-1">Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;