import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, X, Image } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  isAnalyzing: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, isAnalyzing }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setErrorMessage(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file');
      return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size must be less than 5MB');
      return;
    }
    
    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    
    // Send file to parent component
    onUpload(file);
    
    // Clean up preview URL when component unmounts
    return () => URL.revokeObjectURL(previewUrl);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: isAnalyzing
  });

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div 
        {...getRootProps()} 
        className={`
          border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600'
          }
          ${isAnalyzing ? 'opacity-75 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative w-full">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md shadow-md mb-4">
              <img 
                src={preview} 
                alt="Plant preview" 
                className="w-full h-full object-cover"
              />
              
              {!isAnalyzing && (
                <button 
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 p-1 rounded-full shadow-md hover:bg-white dark:hover:bg-black"
                >
                  <X className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                </button>
              )}
            </div>
            
            {isAnalyzing ? (
              <div className="text-center py-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-8 h-8 border-t-4 border-primary-600 border-solid rounded-full mx-auto animate-spin"
                ></motion.div>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  Analyzing your plant image...
                </p>
              </div>
            ) : (
              <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                Click or drag to replace image
              </p>
            )}
          </div>
        ) : (
          <>
            {isDragActive ? (
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <Image className="h-16 w-16 text-primary-500 dark:text-primary-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-primary-600 dark:text-primary-400">
                  Drop your plant image here
                </p>
              </motion.div>
            ) : (
              <div className="text-center">
                <Upload className="h-16 w-16 text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Upload a plant image
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                  Take a clear photo of your plant for the best analysis
                </p>
                <button 
                  type="button"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Select Image
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {errorMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 dark:text-red-400"
        >
          {errorMessage}
        </motion.div>
      )}
      
      <div className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
        <p className="mb-1 font-medium">For best results:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Use good lighting (natural light works best)</li>
          <li>Capture the entire plant or the affected area clearly</li>
          <li>Take close-up photos of any concerning spots</li>
          <li>Supported formats: JPG, PNG (max 5MB)</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUpload;