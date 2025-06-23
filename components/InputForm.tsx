
import React from 'react';

interface InputFormProps {
  country: string;
  setCountry: (country: string) => void;
  timePeriod: string;
  setTimePeriod: (timePeriod: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  country,
  setCountry,
  timePeriod,
  setTimePeriod,
  onSubmit,
  isLoading,
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-gray-800 p-6 rounded-lg shadow-xl space-y-6">
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">
          Country Name
        </label>
        <input
          type="text"
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="e.g., Japan, Brazil, South Africa"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-gray-100 placeholder-gray-500"
          required
        />
      </div>
      <div>
        <label htmlFor="timePeriod" className="block text-sm font-medium text-gray-300 mb-1">
          Time Period
        </label>
        <input
          type="text"
          id="timePeriod"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          placeholder="e.g., last month, past 3 weeks, January 2024"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-gray-100 placeholder-gray-500"
          required
        />
         <p className="mt-2 text-xs text-gray-500">
          Be descriptive: "recent events", "the last 6 months", "current political climate".
        </p>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Events'}
      </button>
    </form>
  );
};
