
import React, { useCallback } from 'react';
import { DownloadIcon, RedoIcon } from './icons';

interface ResultDisplayProps {
  imageUrl: string;
  prompt: string;
  onRegenerate: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, prompt, onRegenerate }) => {
  const fullImageUrl = `data:image/png;base64,${imageUrl}`;

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = fullImageUrl;
    link.download = 'ai-persona.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [fullImageUrl]);
  
  return (
    <div className="bg-brand-surface rounded-2xl shadow-2xl shadow-black/30 p-8 flex flex-col items-center animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-6">Your Persona is Ready!</h2>
      
      <div className="w-full max-w-md aspect-square rounded-lg overflow-hidden shadow-lg mb-6 border-2 border-gray-700">
        <img src={fullImageUrl} alt="Generated Persona" className="w-full h-full object-cover" />
      </div>

      <div className="w-full mb-8">
        <h3 className="text-lg font-semibold text-white mb-2">Generated Prompt:</h3>
        <p className="bg-black/30 p-4 rounded-md text-brand-silver text-sm font-mono border border-gray-700 max-h-32 overflow-y-auto">
          {prompt}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white font-bold py-3 px-5 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500/50 transition-all duration-300 transform hover:scale-105"
        >
          <DownloadIcon className="w-5 h-5" />
          Download
        </button>
        <button
          onClick={onRegenerate}
          className="flex-1 flex items-center justify-center gap-2 bg-brand-red text-white font-bold py-3 px-5 rounded-lg hover:bg-brand-light-red focus:outline-none focus:ring-4 focus:ring-brand-red/50 transition-all duration-300 transform hover:scale-105"
        >
          <RedoIcon className="w-5 h-5" />
          Create New
        </button>
      </div>
    </div>
  );
};
