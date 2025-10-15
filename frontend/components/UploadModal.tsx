import React from 'react';
import UploadZone from './UploadZone';
import { ErrorDisplay } from './ErrorDisplay';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  fileName: string | null;
  error: string | null;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onFileSelect,
  isProcessing,
  fileName,
  error,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-2xl dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">
            Upload Your Utility Bill
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <p className="mb-8 mt-2 text-slate-500 dark:text-slate-400">
          Drop a PDF with one or more bills and let AI do the rest.
        </p>
        <UploadZone
          onFileSelect={onFileSelect}
          isProcessing={isProcessing}
          fileName={fileName}
        />
        {error && <ErrorDisplay message={error} />}
      </div>
    </div>
  );
};

export default UploadModal;