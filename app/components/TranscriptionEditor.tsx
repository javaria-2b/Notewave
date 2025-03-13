'use client';

import React, { useState } from 'react';

interface TranscriptionEditorProps {
  onSave: (note: {
    title: string;
    content: string;
    aiExplanation?: string;
    aiContext?: string;
    aiSummary?: string;
  }) => void;
  initialData?: {
    timestamp?: string;
    subtitleCreator?: string;
    content?: string;
  };
}

export default function TranscriptionEditor({ onSave, initialData }: TranscriptionEditorProps) {
  const [title, setTitle] = useState(initialData?.content?.substring(0, 50) || 'Video Transcription');
  const [timestamp, setTimestamp] = useState(initialData?.timestamp || '00:00:00 - 00:00:00');
  const [subtitleCreator, setSubtitleCreator] = useState(initialData?.subtitleCreator || '');
  const [content, setContent] = useState(initialData?.content || '');

  const handleSave = () => {
    if (!title || !content) return;
    
    onSave({
      title,
      content: `Timestamp: ${timestamp}\nSubtitle Creator: ${subtitleCreator}\n\n${content}`,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Process Video Transcription</h2>
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter transcription title"
          className="w-full p-2 border border-gray-200 rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="timestamp" className="block text-sm font-medium mb-1">
            Timestamp
          </label>
          <input
            type="text"
            id="timestamp"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            placeholder="00:00:00 - 00:00:00"
            className="w-full p-2 border border-gray-200 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="subtitleCreator" className="block text-sm font-medium mb-1">
            Subtitle Creator
          </label>
          <input
            type="text"
            id="subtitleCreator"
            value={subtitleCreator}
            onChange={(e) => setSubtitleCreator(e.target.value)}
            placeholder="Name of subtitle creator"
            className="w-full p-2 border border-gray-200 rounded-md"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          Transcription Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter the transcription content here..."
          className="w-full p-2 border border-gray-200 rounded-md min-h-[200px]"
        />
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!title || !content}
          className="btn-primary disabled:opacity-50"
        >
          Save Transcription
        </button>
      </div>
    </div>
  );
} 