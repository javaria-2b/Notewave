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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if the file is a PDF
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      
      // Check file size (limit to 8MB to stay safely under the 10MB server limit)
      if (selectedFile.size > 8 * 1024 * 1024) {
        setError('File size exceeds 8MB limit. Please upload a smaller PDF file.');
        return;
      }
      
      setFile(selectedFile);
      setTitle(selectedFile.name.replace('.pdf', ''));
      setError('');
    }
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
      formData.append('fileName', file.name); // Add file name separately in case we need it
      
      // Simulate progress while processing
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);
      
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
      console.error('Error processing PDF:', err);
      
      // Provide more specific error messages
      if (err.message && err.message.includes('Body exceeded')) {
        setError('The PDF file is too large to process. Please try a smaller file (under 8MB).');
      } else {
        setError(err.message || 'Failed to process the PDF file. Please try another file.');
      }
      
      setProgress(0);
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
      <div className="max-w-4xl w-full bg-white rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Upload PDF</h2>
        
        {!file ? (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-12 h-12 mx-auto text-gray-400 mb-2"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" 
              />
            </svg>
            <p className="text-lg font-medium">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500 mt-1">PDF files only (max 8MB)</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf" 
              className="hidden" 
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-6 h-6 text-gray-500"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" 
                />
              </svg>
              <div className="flex-1 truncate">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button 
                onClick={() => {
                  setFile(null);
                  setExtractedText('');
                  setProgress(0);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-5 h-5"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" 
                  />
                </svg>
              </button>
            </div>
            
            {!extractedText && (
              <button 
                onClick={extractTextFromPDFFile}
                disabled={isProcessing}
                className={`w-full py-2 px-4 rounded-md ${
                  isProcessing 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-black hover:bg-gray-800 text-white'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Extract Text from PDF'}
              </button>
            )}
            
            {isProcessing && (
              <div className="space-y-2">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-black transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 text-center">{progress}% complete</p>
              </div>
            )}
            
            {extractedText && (
              <>
                <div className="space-y-2">
                  <label htmlFor="title" className="block font-medium">
                    Note Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter a title for your note"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block font-medium">
                    Extracted Text
                  </label>
                  <div className="border border-gray-300 rounded-md p-3 max-h-60 overflow-y-auto bg-gray-50">
                    <p className="whitespace-pre-wrap">{extractedText}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {extractedText.length} characters extracted
                  </p>
                </div>
              </>
            )}
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          
          {extractedText && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Create Note
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 