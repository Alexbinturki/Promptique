import React, { useState, useCallback } from 'react';
import type { Gender } from './types';
import { ImageUploader } from './components/ImageUploader';
import { GenderSelector } from './components/GenderSelector';
import { AgeSelector } from './components/AgeSelector';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { createPromptFromReference, generateFinalImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [userImage, setUserImage] = useState<File | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [age, setAge] = useState<number>(25);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [finalPrompt, setFinalPrompt] = useState<string | null>(null);
  
  const isFormComplete = userImage && referenceImage && gender;

  const handleGenerate = useCallback(async () => {
    if (!isFormComplete) return;

    setIsLoading(true);
    setError(null);
    setResultImageUrl(null);
    setFinalPrompt(null);

    try {
      const referenceImageBase64 = await fileToBase64(referenceImage);
      const userImageBase64 = await fileToBase64(userImage);

      console.log("Step 1: Creating prompt from reference image...");
      const prompt = await createPromptFromReference(referenceImageBase64, gender, age);
      setFinalPrompt(prompt);
      console.log("Step 1 complete. Generated prompt:", prompt);
      
      console.log("Step 2: Generating final image...");
      const imageUrl = await generateFinalImage(userImageBase64, prompt);
      setResultImageUrl(imageUrl);
      console.log("Step 2 complete. Image generated.");

    } catch (err) {
      console.error("An error occurred during generation:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [isFormComplete, referenceImage, userImage, gender, age]);

  const handleRegenerate = () => {
    setUserImage(null);
    setReferenceImage(null);
    setGender(null);
    setAge(25);
    setResultImageUrl(null);
    setFinalPrompt(null);
    setError(null);
  };

  return (
    <div className="bg-brand-dark min-h-screen font-sans text-brand-silver flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 transition-all duration-500">
      <main className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-2">Promptique</h1>
          <p className="text-lg text-brand-silver">Your Style, Your Prompt</p>
        </header>

        {isLoading && <Loader />}

        {!isLoading && resultImageUrl && finalPrompt ? (
          <ResultDisplay 
            imageUrl={resultImageUrl} 
            prompt={finalPrompt} 
            onRegenerate={handleRegenerate}
          />
        ) : (
          <div className="bg-brand-surface rounded-2xl shadow-2xl shadow-black/30 p-8 transition-all duration-300">
            {error && <p className="bg-red-900/50 border border-brand-red text-white p-4 rounded-lg mb-6 text-center">{error}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <ImageUploader
                id="user-image"
                label="Your Photo"
                description="Upload a clear, front-facing photo."
                onFileSelect={setUserImage}
              />
              <ImageUploader
                id="reference-image"
                label="Reference Image"
                description="Upload an AI-generated reference style."
                onFileSelect={setReferenceImage}
              />
            </div>
            
            <div className="mb-8">
              <GenderSelector selectedGender={gender} onGenderChange={setGender} />
            </div>

            <div className="mb-8">
              <AgeSelector selectedAge={age} onAgeChange={setAge} />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!isFormComplete || isLoading}
              className="w-full bg-brand-red text-white font-bold text-xl py-4 px-6 rounded-lg shadow-lg hover:bg-brand-light-red focus:outline-none focus:ring-4 focus:ring-brand-red/50 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 disabled:transform-none"
            >
              Generate Persona
            </button>
          </div>
        )}
      </main>
      <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2025 Promptique. All rights reserved to Mohammed Bin Turki.</p>
      </footer>
    </div>
  );
};

export default App;
