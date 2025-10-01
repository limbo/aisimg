
import React from 'react';
import Spinner from './Spinner';

interface JokeDisplayProps {
  joke: string;
  isLoading: boolean;
  error: string;
}

const JokeDisplay: React.FC<JokeDisplayProps> = ({ joke, isLoading, error }) => {
  return (
    <div className="w-full min-h-[120px] bg-gray-900/50 rounded-lg p-6 flex items-center justify-center text-center transition-all duration-300">
      {isLoading && (
        <div className="space-y-2">
          <Spinner />
          <p className="text-gray-400">Crafting a masterpiece of comedy...</p>
        </div>
      )}
      {error && <p className="text-red-400 font-medium">{error}</p>}
      {!isLoading && !error && joke && (
        <p className="text-lg text-indigo-300 font-medium animate-fade-in">{joke}</p>
      )}
      {!isLoading && !error && !joke && (
        <p className="text-gray-500">Your joke will appear here. Get ready to laugh!</p>
      )}
    </div>
  );
};

export default JokeDisplay;
