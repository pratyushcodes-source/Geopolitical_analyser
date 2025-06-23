import React, { useState } from 'react';
import type { AnalysisResult, Source, AnalysisResponseData } from '../types';
import { SourceItem } from './SourceItem';

interface SentimentIndicatorProps {
  sentiment: string;
}

const SentimentIndicator: React.FC<SentimentIndicatorProps> = ({ sentiment }) => {
  let bgColor = 'bg-gray-500'; // Default for neutral or other
  let textColor = 'text-gray-100';

  if (sentiment?.toLowerCase() === 'positive') {
    bgColor = 'bg-green-500';
    textColor = 'text-green-100';
  } else if (sentiment?.toLowerCase() === 'negative') {
    bgColor = 'bg-red-500';
    textColor = 'text-red-100';
  } else if (sentiment?.toLowerCase() === 'neutral') {
    bgColor = 'bg-yellow-500';
    textColor = 'text-yellow-100';
  }

  return (
    <div className="flex items-center mb-4">
      <span className="text-lg font-semibold text-gray-300 mr-2">Overall Sentiment:</span>
      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${bgColor} ${textColor}`}>
        {sentiment || 'N/A'}
      </span>
    </div>
  );
};

interface ThemeTagProps {
  theme: string;
}

const ThemeTag: React.FC<ThemeTagProps> = ({ theme }) => {
  return (
    <span className="bg-teal-700 text-teal-100 px-3 py-1 text-xs font-medium rounded-full mr-2 mb-2 inline-block shadow">
      {theme}
    </span>
  );
};

interface ResultsDisplayProps {
  analysisResult: AnalysisResult | null;
  sources: Source[] | null;
}

interface AnalysisSectionProps {
  title: string;
  content: unknown; // Accept unknown type and validate
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ title, content }) => {
  // Ensure content is a string before attempting to trim or use string methods.
  if (typeof content !== 'string' || content.trim() === '') {
    // If content is defined but not a string, it means an issue with data consistency from the API.
    // We choose to render nothing for this section in such cases to prevent errors.
    // For development, logging can be helpful:
    // if (content && typeof content !== 'string') {
    //   console.warn(`[AnalysisSection] Content for "${title}" was not a string:`, content, `(Type: ${typeof content})`);
    // }
    return null;
  }

  // At this point, content is confirmed to be a non-empty string.
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-teal-400 mb-2">{title}</h3>
      <div 
        className="text-gray-300 leading-relaxed prose prose-invert max-w-none" 
        dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }} 
      />
    </div>
  );
};


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ analysisResult, sources }) => {
  const [copied, setCopied] = useState(false);

  if (!analysisResult || !analysisResult.structuredAnalysis) {
    return null;
  }

  const { structuredAnalysis, fullAnalysisText } = analysisResult;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullAnalysisText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy: ', err));
  };
  
  const sectionOrder: (keyof AnalysisResponseData)[] = [
    'eventSummary', 
    'geopoliticalSignificance', 
    'keyActors', 
    'futureImplications'
  ];
  
  // Ensure sectionTitles matches keys in AnalysisResponseData, especially those used in sectionOrder
  const sectionTitles: Record<keyof Pick<AnalysisResponseData, 'eventSummary' | 'geopoliticalSignificance' | 'keyActors' | 'futureImplications'>, string> = {
    eventSummary: "Event Summary",
    geopoliticalSignificance: "Geopolitical Significance",
    keyActors: "Key Actors",
    futureImplications: "Future Implications",
  };


  return (
    <div className="mt-10 bg-gray-800 p-6 rounded-lg shadow-xl">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          Geopolitical Analysis
        </h2>
        <button
          onClick={handleCopy}
          className="px-4 py-2 text-sm font-medium rounded-md bg-gray-700 text-teal-400 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500 transition-colors"
          aria-label="Copy analysis to clipboard"
        >
          {copied ? 'Copied!' : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
          {copied ? '' : 'Copy'}
        </button>
      </div>

      <SentimentIndicator sentiment={structuredAnalysis.overallSentiment} />

      {sectionOrder.map(key => (
        <AnalysisSection 
          key={key}
          title={sectionTitles[key]}
          content={structuredAnalysis[key]} // Pass the raw value, AnalysisSection will validate
        />
      ))}


      {structuredAnalysis.keyThemes && structuredAnalysis.keyThemes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-teal-400 mb-3">Key Themes</h3>
          <div className="flex flex-wrap">
            {structuredAnalysis.keyThemes.map((theme, index) => (
              <ThemeTag key={index} theme={theme} />
            ))}
          </div>
        </div>
      )}

      {sources && sources.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h3 className="text-2xl font-semibold mb-4 text-teal-400">Information Sources</h3>
          <ul className="space-y-3">
            {sources.map((source, index) => (
              <SourceItem key={index} source={source} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};