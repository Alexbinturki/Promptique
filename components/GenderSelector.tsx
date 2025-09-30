
import React from 'react';
import type { Gender } from '../types';

interface GenderSelectorProps {
  selectedGender: Gender | null;
  onGenderChange: (gender: Gender) => void;
}

export const GenderSelector: React.FC<GenderSelectorProps> = ({ selectedGender, onGenderChange }) => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold text-white mb-4">Select Gender</h3>
      <div className="flex justify-center gap-4 w-full">
        {(['male', 'female'] as Gender[]).map((gender) => (
          <label
            key={gender}
            className={`flex-1 p-4 rounded-lg cursor-pointer text-center font-semibold text-lg border-2 transition-all duration-300 transform hover:scale-105 ${
              selectedGender === gender
                ? 'bg-brand-red border-brand-red text-white shadow-lg'
                : 'bg-gray-700 border-gray-600 text-brand-silver hover:border-brand-silver'
            }`}
          >
            <input
              type="radio"
              name="gender"
              value={gender}
              checked={selectedGender === gender}
              onChange={() => onGenderChange(gender)}
              className="sr-only"
            />
            {gender.charAt(0).toUpperCase() + gender.slice(1)}
          </label>
        ))}
      </div>
    </div>
  );
};
