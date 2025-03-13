'use client';

import React, { useState, useRef, useEffect } from 'react';
import { transcribeAudio } from '../lib/actions';

interface AudioRecorderProps {
  onClose: () => void;
  onSave: (audioBlob: Blob, transcription?: string) => void;
}

export default function AudioRecorder({ onClose, onSave }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });
      
      mediaRecorderRef.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        audioBlobRef.current = audioBlob;
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setTranscription(null); // Reset transcription when recording new audio
        setError(null);
      });
      
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Could not access microphone. Please make sure you have granted permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Stop the tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleTranscribe = async () => {
    if (!audioBlobRef.current) return;
    
    setIsTranscribing(true);
    setError(null);
    setTranscriptionProgress(0);
    
    // Start progress animation (simulated progress while waiting for API)
    progressTimerRef.current = setInterval(() => {
      setTranscriptionProgress(prev => {
        const newProgress = prev + (100 - prev) * 0.1;
        return newProgress > 95 ? 95 : newProgress;
      });
    }, 300);
    
    try {
      // Create FormData to send the audio file
      const formData = new FormData();
      formData.append('file', audioBlobRef.current, 'recording.wav');
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
    if (audioBlobRef.current) {
      onSave(audioBlobRef.current, transcription || undefined);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
        <h2 className="text-xl font-bold mb-4">Record Audio</h2>
        <p className="text-gray-500 mb-6">Click the button below to start recording your note</p>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="flex flex-col items-center justify-center gap-4 mb-6">
          <div className="text-2xl font-mono">
            {formatTime(recordingTime)}
          </div>
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isRecording 
                ? 'bg-red-100 text-red-600 animate-pulse' 
                : 'bg-red-500 text-white'
            }`}
          >
            {isRecording ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
            )}
          </button>
          
          <div className="text-sm text-gray-500">
            {isRecording ? 'Press to stop recording' : 'Press to start recording'}
          </div>
        </div>
        
        {audioUrl && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <audio src={audioUrl} controls className="w-full mb-4" />
            
            {!transcription && !isTranscribing && (
              <button
                onClick={handleTranscribe}
                className="w-full btn-secondary mb-4"
                disabled={isTranscribing}
              >
                {isTranscribing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-gray-600"></div>
                    Transcribing...
                  </>
                ) : (
                  "Transcribe Audio"
                )}
              </button>
            )}
            
            {isTranscribing && (
              <div className="mb-4 p-4 border border-gray-200 rounded-md">
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-blue-600"></div>
                  <p>Transcribing your audio...</p>
                </div>
              </div>
            )}
            
            {transcription && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Transcription:</p>
                <div className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap text-sm">
                  {transcription}
                </div>
              </div>
            )}
          </div>
        )}
        
        {renderTranscriptionProgress()}
        
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!audioUrl}
            className="btn-primary disabled:opacity-50"
          >
            Save Recording
          </button>
        </div>
      </div>
    </div>
  );
} 