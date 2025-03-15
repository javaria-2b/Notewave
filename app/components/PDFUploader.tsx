'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { extractTextFromPDF } from '../lib/actions';

interface PDFUploaderProps {
  onClose: () => void;
  onSave: (title: string, content: string) => void;
}

export default function PDFUploader({ onClose, onSave }: PDFUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError('');
    
    if (!selectedFile) {
      return;
    }
    
    // Check if file is a PDF
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file');
      return;
    }
    
    // Check file size (8MB limit)
    const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB in bytes
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File size exceeds the 8MB limit');
      return;
    }
    
    setFile(selectedFile);
    // Auto-set the title based on the file name (without extension)
    const fileName = selectedFile.name.replace(/\.[^/.]+$/, "");
    setTitle(fileName);
  };

  const extractTextFromPDFFile = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(10); // Start progress
    setError('');
    
    try {
      // Create a FormData object to send the file to the server
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate progress while processing
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);
      
      try {
        // Call the server action to extract text
        const result = await extractTextFromPDF(formData);
        
        clearInterval(progressInterval);
        setProgress(100);
        
        if (result && result.text) {
          setExtractedText(result.text);
        } else {
          throw new Error('Failed to extract text from PDF');
        }
      } catch (err: any) {
        clearInterval(progressInterval);
        console.error('Error processing PDF:', err);
        
        // Provide more specific error messages
        if (err.message && err.message.includes('Body exceeded')) {
          setError('The PDF file is too large to process. Please try a smaller file (under 8MB).');
        } else if (err.message && err.message.includes('AI')) {
          setError('Our AI service is temporarily unavailable. Please try again later.');
        } else {
          setError('Failed to process the PDF file. Please try another file or try again later.');
        }
        
        setProgress(0);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    if (!extractedText.trim()) {
      setError('No text was extracted from the PDF');
      return;
    }
    
    onSave(title, extractedText);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (droppedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      
      // Check file size (limit to 8MB to stay safely under the 10MB server limit)
      if (droppedFile.size > 8 * 1024 * 1024) {
        setError('File size exceeds 8MB limit. Please upload a smaller PDF file.');
        return;
      }
      
      setFile(droppedFile);
      setTitle(droppedFile.name.replace('.pdf', ''));
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Upload PDF</h2>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md mb-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>{error}</p>
            </div>
            <p className="mt-2 text-sm pl-7">Try using a different PDF file or check that the file is not corrupted.</p>
          </div>
        )}
        
        {!file ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <svg
                className="w-12 h-12 text-gray-400 dark:text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg font-medium dark:text-white">
                Drag and drop your PDF file here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                or click to browse (max 8MB)
              </p>
              <label className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 cursor-pointer">
                Select PDF
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                <svg
                  className="w-8 h-8 text-gray-700 dark:text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate dark:text-white">{file.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setTitle('');
                  setExtractedText('');
                  setProgress(0);
                }}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium dark:text-white">
                Note Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white"
                placeholder="Enter a title for your note"
              />
            </div>

            {isProcessing ? (
              <div className="space-y-2">
                <p className="text-sm font-medium dark:text-white">Processing PDF...</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-black dark:bg-gray-300 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This may take a moment depending on the file size
                </p>
              </div>
            ) : (
              <button
                onClick={extractTextFromPDFFile}
                disabled={isProcessing || !file}
                className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {error ? 'Retry Processing' : (extractedText ? 'Reprocess PDF' : 'Process PDF')}
              </button>
            )}

            {extractedText && (
              <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 max-h-60 overflow-y-auto">
                <p className="text-sm font-medium mb-2 dark:text-white">Generated Notes:</p>
                <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap markdown-content">
                  {extractedText.substring(0, 500)}
                  {extractedText.length > 500 && '...'}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {extractedText.length} characters of notes generated. The full content will be saved with your note.
                </p>
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded text-xs text-blue-700 dark:text-blue-300">
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    These notes are generated based on the PDF's content. You can edit them after saving.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white"
          >
            Cancel
          </button>
          {extractedText && (
            <button
              onClick={handleSave}
              className="ml-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Save Note
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 