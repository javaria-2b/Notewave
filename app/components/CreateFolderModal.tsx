import React, { useState, useEffect } from 'react';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (name: string) => void;
  editFolder?: {
    id: string;
    name: string;
  };
  onUpdateFolder?: (id: string, name: string) => void;
}

export default function CreateFolderModal({ 
  isOpen, 
  onClose,
  onCreateFolder,
  editFolder,
  onUpdateFolder
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState('');
  const isEditing = !!editFolder;

  // Set folder name if in edit mode
  useEffect(() => {
    if (editFolder && isOpen) {
      setFolderName(editFolder.name);
    } else if (!isOpen) {
      setFolderName('');
    }
  }, [editFolder, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      if (isEditing && onUpdateFolder && editFolder) {
        onUpdateFolder(editFolder.id, folderName);
      } else {
        onCreateFolder(folderName);
      }
      setFolderName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-black">
          {isEditing ? 'Edit folder' : 'Create new folder'}
        </h2>
        <p className="text-gray-500 mb-4">
          {isEditing ? 'Update the folder name' : 'Create a new folder to organize your notes'}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="folderName" className="block text-sm font-medium mb-1 text-black">
              Folder name
            </label>
            <input
              type="text"
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              autoFocus
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-100 text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!folderName.trim()}
            >
              {isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 