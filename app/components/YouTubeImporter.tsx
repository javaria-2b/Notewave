'use client';

import { useState, useRef } from 'react';
import { generateYouTubeNotes } from '../lib/actions';

interface YouTubeImporterProps {
  onClose: () => void;
  onSave: (title: string, content: string) => void;
}

export default function YouTubeImporter({ onClose, onSave }: YouTubeImporterProps) {
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoMetadata, setVideoMetadata] = useState<{title?: string, author?: string} | null>(null);
  const [hasTranscript, setHasTranscript] = useState(false);
  const [processingStage, setProcessingStage] = useState<'idle' | 'extracting' | 'generating'>('idle');

  // Extract YouTube video ID from URL
  const extractVideoId = (url: string): string | null => {
    // Handle different YouTube URL formats
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,  // Standard watch URL
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/i,              // Shortened URL
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/i,     // Embed URL
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^?]+)/i,         // Old embed URL
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/i     // YouTube Shorts
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    setError('');
    setVideoMetadata(null);
    setHasTranscript(false);
    
    // Try to extract video ID
    const id = extractVideoId(url);
    setVideoId(id);
    
    if (id) {
      // Try to fetch basic metadata for preview
      fetchVideoMetadata(id);
    }
  };
  
  const fetchVideoMetadata = async (id: string) => {
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
      if (response.ok) {
        const data = await response.json();
        setVideoMetadata({
          title: data.title,
          author: data.author_name
        });
        
        // Set default title based on video title
        if (data.title) {
          setTitle(`Notes: ${data.title}`);
        } else {
          setTitle(`Notes from YouTube video (${id})`);
        }
      }
    } catch (error) {
      console.error('Error fetching video metadata:', error);
      // Don't show error to user, just use the ID as fallback
      setTitle(`Notes from YouTube video (${id})`);
    }
  };

  const handleGenerateNotes = async () => {
    // Validate URL
    if (!videoUrl.trim()) {
      setError('Please enter a YouTube video URL');
      return;
    }
    
    const id = extractVideoId(videoUrl);
    if (!id) {
      setError('Invalid YouTube URL. Please enter a valid YouTube video link.');
      return;
    }
    
    setIsProcessing(true);
    setProgress(10);
    setError('');
    setProcessingStage('extracting');
    
    try {
      // Simulate progress while processing
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);
      
      // Call the server action to generate notes
      const result = await generateYouTubeNotes(id);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (result && result.content) {
        setGeneratedContent(result.content);
        setHasTranscript(result.hasTranscript || false);
        
        // Update title if provided
        if (result.title) {
          setTitle(`Notes: ${result.title}`);
        }
      } else {
        throw new Error('Failed to generate notes from YouTube video');
      }
    } catch (err: any) {
      console.error('Error processing YouTube video:', err);
      setError(err.message || 'Failed to process the YouTube video. Please try another link.');
      setProgress(0);
    } finally {
      setIsProcessing(false);
      setProcessingStage('idle');
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    if (!generatedContent.trim()) {
      setError('No content was generated');
      return;
    }
    
    onSave(title, generatedContent);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="max-w-4xl w-full bg-white rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Import YouTube Video</h2>
        
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md mb-4">
            <p className="text-sm">
              <strong>Note:</strong> This feature attempts to extract the transcript from YouTube videos when available.
              If a transcript cannot be found, it will generate AI-based notes from video metadata instead.
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="youtube-url" className="block font-medium">
              YouTube Video URL
            </label>
            <input
              type="text"
              id="youtube-url"
              value={videoUrl}
              onChange={handleUrlChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-sm text-gray-500">
              Enter the URL of a YouTube video (supports standard links, youtu.be, embeds, and shorts)
            </p>
          </div>
          
          {videoId && videoMetadata && !generatedContent && (
            <div className="space-y-2">
              <div className="aspect-video w-full max-w-2xl mx-auto bg-gray-100 rounded-md overflow-hidden">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${videoId}`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              
              {videoMetadata.title && (
                <div className="text-center">
                  <p className="font-medium">{videoMetadata.title}</p>
                  {videoMetadata.author && (
                    <p className="text-sm text-gray-500">by {videoMetadata.author}</p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {videoId && !generatedContent && !isProcessing && (
            <button 
              onClick={handleGenerateNotes}
              className="w-full py-2 px-4 rounded-md bg-black hover:bg-gray-800 text-white"
            >
              Extract Transcript & Generate Notes
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
              <p className="text-center text-sm">
                {processingStage === 'extracting' 
                  ? 'Attempting to extract transcript from video...' 
                  : 'Analyzing content and generating notes...'}
              </p>
            </div>
          )}
          
          {generatedContent && (
            <>
              <div className="space-y-2">
                <label htmlFor="note-title" className="block font-medium">
                  Note Title
                </label>
                <input
                  type="text"
                  id="note-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter a title for your note"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-medium">
                    Generated Notes
                  </label>
                  {hasTranscript ? (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      Based on actual transcript
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                      Based on video metadata
                    </span>
                  )}
                </div>
                <div className="border border-gray-300 rounded-md p-3 max-h-60 overflow-y-auto bg-gray-50">
                  <p className="whitespace-pre-wrap">{generatedContent}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {generatedContent.length} characters generated
                </p>
                <p className="text-xs text-gray-400 italic">
                  {hasTranscript 
                    ? "These notes are generated from the video's actual transcript."
                    : "These notes are AI-generated based on available metadata, not an actual transcript of the video."}
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
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          
          {generatedContent && (
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