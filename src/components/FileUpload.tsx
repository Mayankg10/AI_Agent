'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, File, Image, X, FileText, Code, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File, content: string) => void;
  disabled?: boolean;
}

const SUPPORTED_TYPES = {
  'image/jpeg': { icon: Image, label: 'JPEG Image' },
  'image/png': { icon: Image, label: 'PNG Image' },
  'image/gif': { icon: Image, label: 'GIF Image' },
  'image/webp': { icon: Image, label: 'WebP Image' },
  'text/plain': { icon: FileText, label: 'Text File' },
  'application/pdf': { icon: FileText, label: 'PDF Document' },
  'text/javascript': { icon: Code, label: 'JavaScript' },
  'text/typescript': { icon: Code, label: 'TypeScript' },
  'text/html': { icon: Code, label: 'HTML' },
  'text/css': { icon: Code, label: 'CSS' },
  'application/json': { icon: Code, label: 'JSON' },
  'text/markdown': { icon: FileText, label: 'Markdown' },
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function FileUpload({ onFileUpload, disabled = false }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    
    if (!Object.keys(SUPPORTED_TYPES).includes(file.type)) {
      return 'Unsupported file type';
    }
    
    return null;
  };

  const processFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploadingFile(file);
    setError(null);

    try {
      let content = '';
      
      if (file.type.startsWith('image/')) {
        // For images, provide a helpful message since we can't process them visually
        content = `I can see that you've uploaded an image file (${file.name}, ${(file.size / 1024).toFixed(1)}KB), but I'm unable to visually analyze images in this interface. However, I can help you with:

• Describing what you'd like to know about the image
• Suggesting image analysis tools or techniques
• Helping with image-related programming or technical questions
• Providing guidance on image formats, compression, or processing
• Assisting with image-related code or workflows

Please let me know how I can assist you with this image!`;
      } else if (file.type.startsWith('text/') || file.type === 'application/json') {
        // For text files, read the content
        content = await file.text();
      } else if (file.type === 'application/pdf') {
        // For PDFs, we'll indicate it's a PDF (actual PDF parsing would need additional libraries)
        content = `I can see you've uploaded a PDF document (${file.name}, ${(file.size / 1024).toFixed(1)}KB). While I can't directly read PDF content in this interface, I can help you with:

• PDF-related programming questions
• Document processing workflows
• Converting PDFs to other formats
• PDF manipulation techniques
• Extracting information from PDFs using code

Please let me know how I can assist you with this PDF!`;
      }

      onFileUpload(file, content);
    } catch (error) {
      setError('Failed to process file');
      console.error('File processing error:', error);
    } finally {
      setUploadingFile(null);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]); // Process only the first file
    }
  }, [disabled]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept={Object.keys(SUPPORTED_TYPES).join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-6 transition-all duration-200 cursor-pointer
          ${isDragging 
            ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/20' 
            : 'border-slate-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${uploadingFile ? 'pointer-events-none' : ''}
        `}
      >
        {uploadingFile ? (
          <div className="flex items-center justify-center space-x-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Processing {uploadingFile.name}...
            </span>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="w-8 h-8 mx-auto mb-3 text-slate-400 dark:text-slate-500" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              {isDragging ? 'Drop your file here' : 'Upload a file or drag & drop'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Supports images, text files, code, and PDFs (max 5MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-700 dark:text-red-400">
                {error}
              </span>
            </div>
            <button
              onClick={clearError}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
      )}

      {/* Supported file types */}
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(SUPPORTED_TYPES).slice(0, 6).map(([type, { icon: Icon, label }]) => (
          <div
            key={type}
            className="flex items-center space-x-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg"
          >
            <Icon className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            <span className="text-xs text-slate-600 dark:text-slate-400">{label}</span>
          </div>
        ))}
        {Object.keys(SUPPORTED_TYPES).length > 6 && (
          <div className="flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              +{Object.keys(SUPPORTED_TYPES).length - 6} more
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
