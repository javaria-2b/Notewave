'use client';

import React, { useState } from 'react';

interface NoteEditorProps {
  onSave: (note: {
    title: string;
    content: string;
    aiExplanation?: string;
    aiContext?: string;
    aiSummary?: string;
  }) => void;
}

export default function NoteEditor({ onSave }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = () => {
    if (!title || !content) return;
    
    onSave({
      title,
      content,
    });

    // Show success message
    setIsSaved(true);
    
    // Reset the success message after 3 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);

    // Reset the form
    setTitle('');
    setContent('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Create New Note</h2>
      
      {isSaved && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md">
          Note saved successfully! Your note will be available in your notes list.
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title"
          className="w-full p-2 border border-gray-200 rounded-md"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          Note Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your note content here..."
          className="w-full p-2 border border-gray-200 rounded-md min-h-[200px]"
        />
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!title || !content}
          className="btn-primary disabled:opacity-50"
        >
          Save Note
        </button>
      </div>
    </div>
  );
} 