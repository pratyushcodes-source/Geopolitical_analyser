
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-4xl text-center py-6">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
        Geopolitical Event Analyzer
      </h1>
      <p className="text-gray-400 mt-2 text-lg">
        Explore global events and their geopolitical significance.
      </p>
    </header>
  );
};
