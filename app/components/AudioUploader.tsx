'use client';

import React, { useState, useRef } from 'react';
import { transcribeAudio } from '../lib/actions';

interface AudioUploaderProps {
  onClose: () => void;
  onSave: (audioBlob: Blob, transcription?: string) => void;
}

export default function AudioUploader({ onClose, onSave }: AudioUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check if file is an audio file
    if (!selectedFile.type.startsWith('audio/')) {
      setError('Please upload an audio file (mp3, wav, m4a, etc.)');
      return;
    }

    // Check file size (limit to 25MB - Whisper API limit)
    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('Audio file must be less than 25MB');
      return;
    }

    setFile(selectedFile);
    setError(null);
    
    // Create an audio URL for preview
    const url = URL.createObjectURL(selectedFile);
    setAudioUrl(url);
  };

  const handleTranscribe = async () => {
    if (!file) return;
    
    setIsTranscribing(true);
    setError(null);
    setTranscriptionProgress(0);
    
    // Start progress animation
    progressTimerRef.current = setInterval(() => {
      setTranscriptionProgress(prev => {
        const newProgress = prev + (100 - prev) * 0.1;
        return newProgress > 95 ? 95 : newProgress;
      });
    }, 300);
    
    try {
      // Create FormData to send the audio file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('model', 'whisper-1');
      
      // Call the transcribe function
      const result = await transcribeAudio(formData);
      setTranscription(result.text);
      setTranscriptionProgress(100);
    } catch (err: any) {
      console.error('Transcription error:', err);
      setError(`Failed to transcribe audio: ${err.message || 'Unknown error'}`);
      setTranscriptionProgress(0);
    } finally {
      setIsTranscribing(false);
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    }
  };

  const handleSave = () => {
    if (file) {
      onSave(file, transcription || undefined);
    }
  };

  const renderTranscriptionProgress = () => {
    if (!isTranscribing && transcriptionProgress <= 0) return null;
    
    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Transcription Progress</span>
          <span>{Math.round(transcriptionProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${transcriptionProgress}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Upload Audio</h2>
        <p className="text-gray-500 mb-6">Upload an audio file to transcribe it using AI</p>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="audio-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">MP3, WAV, M4A up to 25MB</p>
              </div>
              <input
                id="audio-upload"
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
        
        {audioUrl && (
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Audio Preview:</p>
            <audio src={audioUrl} controls className="w-full" />
          </div>
        )}
        
        {renderTranscriptionProgress()}
        
        {transcription && (
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Transcription:</p>
            <div className="p-3 bg-gray-50 rounded-md text-sm max-h-40 overflow-y-auto">
              {transcription}
            </div>
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <div className="space-x-2">
            {!transcription && file && (
              <button
                onClick={handleTranscribe}
                disabled={!file || isTranscribing}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTranscribing ? 'Transcribing...' : 'Transcribe'}
              </button>
            )}
            
            {transcription && (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 