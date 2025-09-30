
import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  id: string;
  label: string;
  description: string;
  onFileSelect: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, description, onFileSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold text-white mb-2">{label}</h3>
      <p className="text-sm text-brand-silver mb-4 text-center">{description}</p>
      <div
        onClick={handleClick}
        className="w-full h-48 sm:h-64 rounded-xl border-2 border-dashed border-gray-600 flex flex-col items-center justify-center cursor-pointer bg-black/20 hover:bg-black/40 hover:border-brand-red transition-all duration-300 relative overflow-hidden group"
      >
        <input
          type="file"
          id={id}
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg"
          className="hidden"
        />
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-400 p-4">
            <UploadIcon className="w-10 h-10 mx-auto mb-2 text-gray-500 group-hover:text-brand-red transition-colors" />
            <span className="font-medium">Click to upload</span>
          </div>
        )}
      </div>
    </div>
  );
};
