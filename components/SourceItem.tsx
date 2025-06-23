
import React from 'react';
import type { Source } from '../types';

interface SourceItemProps {
  source: Source;
}

export const SourceItem: React.FC<SourceItemProps> = ({ source }) => {
  return (
    <li className="bg-gray-700 p-4 rounded-md shadow-md hover:bg-gray-600 transition-colors duration-150">
      <a
        href={source.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="group"
      >
        <h4 className="text-md font-semibold text-teal-400 group-hover:text-teal-300 group-hover:underline">
          {source.title || 'Untitled Source'}
        </h4>
        <p className="text-xs text-gray-400 truncate group-hover:text-gray-300">{source.uri}</p>
      </a>
    </li>
  );
};
