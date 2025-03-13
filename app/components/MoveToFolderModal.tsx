'use client';

import React from 'react';
import { Folder } from '../lib/folderStorage';

interface MoveToFolderModalProps {
  folders: Folder[];
  onClose: () => void;
  onSelect: (folderId: string) => void;
  currentFolderId?: string;
}

export default function MoveToFolderModal({
  folders,
  onClose,
  onSelect,
  currentFolderId
}: MoveToFolderModalProps) {
  const handleMoveToFolder = (folderId: string) => {
    onSelect(folderId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Move to Folder</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-500 mb-4">Select a folder to move this note to:</p>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => handleMoveToFolder(folder.id)}
              className={`flex items-center w-full p-2 rounded-md hover:bg-purple-50 ${
                folder.id === currentFolderId ? 'bg-purple-100 text-purple-800' : 'text-black'
              }`}
              disabled={folder.id === currentFolderId}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-4 w-4 mr-2 ${folder.id === currentFolderId ? 'text-purple-600' : 'text-gray-500'}`}
              >
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
              </svg>
              {folder.name}
              {folder.id === currentFolderId && (
                <span className="ml-2 text-xs text-purple-600">(Current)</span>
              )}
            </button>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-100 text-black"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 