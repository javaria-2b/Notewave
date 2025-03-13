'use client';

import React, { useState } from 'react';
import { Folder } from '../lib/folderStorage';

interface FolderManagerProps {
  folders: Folder[];
  onRenameFolder: (folderId: string, newName: string) => void;
  onDeleteFolder: (folderId: string) => void;
  selectedFolder: string;
  onSelectFolder: (folderId: string) => void;
  onCreateFolderClick: () => void;
}

export default function FolderManager({
  folders,
  onRenameFolder,
  onDeleteFolder,
  selectedFolder,
  onSelectFolder,
  onCreateFolderClick
}: FolderManagerProps) {
  const [editFolderId, setEditFolderId] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleEditClick = (folder: Folder, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditFolderId(folder.id);
    setEditFolderName(folder.name);
  };

  const handleDeleteClick = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(folderId);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editFolderId && editFolderName.trim()) {
      onRenameFolder(editFolderId, editFolderName);
      setEditFolderId(null);
    }
  };

  const confirmDelete = (folderId: string) => {
    onDeleteFolder(folderId);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-black">Folders</h3>
        <button 
          onClick={onCreateFolderClick}
          className="flex items-center gap-1 text-sm text-black hover:text-gray-800 px-2 py-1 rounded-md hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Folder
        </button>
      </div>

      <div className="space-y-1">
        <button
          onClick={() => onSelectFolder('all')}
          className={`flex items-center justify-between w-full p-2 rounded-md text-left text-base ${
            selectedFolder === 'all' 
              ? 'bg-gray-200 text-black font-medium' 
              : 'hover:bg-gray-100 text-black'
          }`}
        >
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-5 w-5 ${selectedFolder === 'all' ? 'text-black' : 'text-gray-600'}`}
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 7h10M7 12h10M7 17h10" />
            </svg>
            All Notes
          </div>
        </button>

        {folders.map((folder) => (
          <div key={folder.id} className="relative">
            {editFolderId === folder.id ? (
              <form onSubmit={handleEditSubmit} className="p-1">
                <input
                  type="text"
                  value={editFolderName}
                  onChange={(e) => setEditFolderName(e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  autoFocus
                  onBlur={() => setEditFolderId(null)}
                />
              </form>
            ) : (
              <button
                onClick={() => onSelectFolder(folder.id)}
                className={`group flex items-center justify-between w-full p-2 rounded-md text-left text-base ${
                  selectedFolder === folder.id 
                    ? 'bg-gray-200 text-black font-medium' 
                    : 'hover:bg-gray-100 text-black'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`h-5 w-5 ${selectedFolder === folder.id ? 'text-black' : 'text-gray-600'}`}
                  >
                    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                  </svg>
                  <span className="truncate">{folder.name}</span>
                </div>
                
                <div className="flex ml-2 transition-opacity">
                  <button 
                    onClick={(e) => handleEditClick(folder, e)}
                    className="p-1 text-gray-600 hover:text-black rounded-full"
                    title="Edit folder name"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  <button 
                    onClick={(e) => handleDeleteClick(folder.id, e)}
                    className="p-1 text-gray-600 hover:text-red-600 rounded-full"
                    title="Delete folder"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 text-black">Delete Folder</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this folder? All notes will be moved to "My Notes".
            </p>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-100 text-black"
              >
                Cancel
              </button>
              <button
                onClick={() => showDeleteConfirm && confirmDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 