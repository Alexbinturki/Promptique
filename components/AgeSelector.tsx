import React from 'react';

interface AgeSelectorProps {
  selectedAge: number;
  onAgeChange: (age: number) => void;
}

export const AgeSelector: React.FC<AgeSelectorProps> = ({ selectedAge, onAgeChange }) => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold text-white mb-4">Select Age</h3>
      <div className="w-full flex items-center gap-4">
        <input
          type="range"
          min="1"
          max="100"
          value={selectedAge}
          onChange={(e) => onAgeChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-red"
        />
        <span className="bg-gray-700 text-white text-lg font-semibold rounded-md px-4 py-1 w-20 text-center">
          {selectedAge}
        </span>
      </div>
    </div>
  );
};
