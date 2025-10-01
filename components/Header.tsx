
import React from 'react';

interface HeaderProps {
    onInstallClick: () => void;
    installable: boolean;
}

const Header: React.FC<HeaderProps> = ({ onInstallClick, installable }) => {
  return (
    <header className="sm:flex sm:justify-between sm:items-center text-center sm:text-left">
      <div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          Image Joke Generator
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Upload a picture and let AI tickle your funny bone!
        </p>
      </div>
      {installable && (
        <div className="mt-4 sm:mt-0">
          <button
            onClick={onInstallClick}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-transform duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
            aria-label="Install App"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Install App</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
