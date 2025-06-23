import React from 'react';
import type { HistoryItem } from '../types';

interface HistoryPanelProps {
  historyItems: HistoryItem[];
  onLoadItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ historyItems, onLoadItem, onClearHistory, onDeleteItem }) => {
  if (historyItems.length === 0) {
    return (
      <div id="history-panel" className="mt-8 bg-gray-800 p-6 rounded-lg shadow-xl text-center">
        <p className="text-gray-400">No analysis history yet.</p>
      </div>
    );
  }

  return (
    <div id="history-panel" className="mt-8 bg-gray-800 p-6 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-teal-400">Analysis History</h2>
        <button
          onClick={onClearHistory}
          className="px-4 py-2 text-sm font-medium rounded-md bg-red-700 text-red-100 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors"
          aria-label="Clear all analysis history"
        >
          Clear All History
        </button>
      </div>
      <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {historyItems.map((item) => (
          <li key={item.id} className="p-4 bg-gray-700 rounded-md shadow-md hover:bg-gray-600 transition-colors group">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-teal-300">
                  {item.country} - <span className="text-gray-300 font-normal">{item.timePeriod}</span>
                </p>
                <p className="text-xs text-gray-500 group-hover:text-gray-400">
                  Analyzed on: {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2 flex-shrink-0 ml-2">
                <button
                  onClick={() => onLoadItem(item)}
                  className="px-3 py-1 text-xs font-medium rounded-md bg-blue-600 text-blue-100 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 focus:ring-blue-500 transition-colors"
                  aria-label={`Load analysis for ${item.country} from ${new Date(item.timestamp).toLocaleString()}`}
                >
                  Load
                </button>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="px-3 py-1 text-xs font-medium rounded-md bg-red-700 text-red-100 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 focus:ring-red-500 transition-colors"
                  aria-label={`Delete analysis for ${item.country} from ${new Date(item.timestamp).toLocaleString()}`}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
