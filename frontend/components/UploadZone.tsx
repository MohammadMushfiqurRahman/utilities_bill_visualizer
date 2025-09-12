import React, { useState, useCallback } from 'react';
import { UploadIcon, PdfFileIcon, ProcessingIcon } from './icons';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  fileName: string | null;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isProcessing, fileName }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (e.dataTransfer.files[0].type === 'application/pdf') {
        onFileSelect(e.dataTransfer.files[0]);
      }
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const borderStyle = isDragging ? 'border-blue-500' : 'border-slate-300 dark:border-slate-600';

  const content = isProcessing ? (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-3">
        <ProcessingIcon className="h-8 w-8 animate-spin text-blue-500" />
        <span className="text-lg font-medium text-slate-600 dark:text-slate-300">
          Processing...
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{fileName}</p>
    </div>
  ) : (
    <div className="text-center">
      <UploadIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
      <div className="mt-4 flex text-sm leading-6 text-slate-600 dark:text-slate-300">
        <label
          htmlFor="file-upload"
          className="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:outline-none hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
        >
          <span>Upload a file</span>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
        </label>
        <p className="pl-1">or drag and drop</p>
      </div>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">PDF up to 10MB</p>
    </div>
  );

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`mt-2 flex justify-center rounded-lg border-2 border-dashed ${borderStyle} bg-white px-6 py-10 transition-colors duration-200 dark:bg-slate-800/50`}
    >
      {content}
    </div>
  );
};

export default UploadZone;
