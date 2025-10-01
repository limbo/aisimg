
import React, { useState, useCallback, useEffect } from 'react';
import { generateJokeFromImage } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import JokeDisplay from './components/JokeDisplay';

// This interface might be available in some TS lib definitions, 
// but it's safer to define it for broader compatibility.
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [joke, setJoke] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPromptEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = useCallback(() => {
    if (!installPromptEvent) {
      return;
    }
    // Show the install prompt
    installPromptEvent.prompt();
    // Wait for the user to respond to the prompt
    installPromptEvent.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      // We can only prompt once.
      setInstallPromptEvent(null);
    });
  }, [installPromptEvent]);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setJoke('');
    setError('');
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove "data:image/jpeg;base64," part
        resolve(result.split(',')[1]);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleGenerateJoke = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setJoke('');

    try {
      const base64Image = await fileToBase64(imageFile);
      const generatedJoke = await generateJokeFromImage(base64Image, imageFile.type);
      setJoke(generatedJoke);
    } catch (err) {
      setError('Failed to generate a joke. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <Header onInstallClick={handleInstallClick} installable={!!installPromptEvent} />
        <main className="mt-8 bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 space-y-6">
          <ImageUploader onImageUpload={handleImageUpload} imageUrl={imageUrl} />
          
          <div className="text-center">
            <button
              onClick={handleGenerateJoke}
              disabled={!imageFile || isLoading}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-transform duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              {isLoading ? 'Thinking...' : 'Generate Joke'}
            </button>
          </div>
          
          <JokeDisplay joke={joke} isLoading={isLoading} error={error} />
        </main>
      </div>
    </div>
  );
};

export default App;
