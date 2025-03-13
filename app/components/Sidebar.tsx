 'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import CreateFolderModal from './CreateFolderModal';
import { Folder, getFolders, saveFolder, deleteFolder } from '../lib/folderStorage';
import FolderManager from './FolderManager';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [editFolder, setEditFolder] = useState<{id: string, name: string} | null>(null);

  // Function to refresh folders from localStorage
  const refreshFolders = () => {
    const storedFolders = getFolders();
    setFolders(storedFolders);
  };

  // Load data on component mount
  useEffect(() => {
    refreshFolders();
  }, []);

  const handleCreateFolder = (name: string) => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name: name,
      createdAt: new Date().toISOString()
    };
    saveFolder(newFolder);
    refreshFolders();
  };

  const handleUpdateFolder = (id: string, name: string) => {
    const folder = folders.find(f => f.id === id);
    if (folder) {
      const updatedFolder: Folder = {
        ...folder,
        name: name
      };
      saveFolder(updatedFolder);
      refreshFolders();
    }
  };

  const handleDeleteFolder = (id: string) => {
    deleteFolder(id);
    refreshFolders();
    if (selectedFolder === id) {
      setSelectedFolder('all');
      // Update the URL if we're in a deleted folder
      if (pathname.includes(`folder=${id}`)) {
        router.push('/home');
      }
    }
  };

  const handleSelectFolder = (folderId: string) => {
    setSelectedFolder(folderId);
    
    // Navigate to the selected folder
    if (folderId === 'all') {
      router.push('/home');
    } else {
      router.push(`/home?folder=${folderId}`);
    }
  };

  return (
    <aside className="w-60 h-screen border-r border-gray-300 flex flex-col bg-white sticky top-0">
      <div className="p-4 border-b border-gray-300 text-black">
        <Link href="/home" className="flex items-center gap-2">
          <div className="text-xl font-bold flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="10" r="3" />
              <path d="M7 16.3c0-1 1-2 2.5-2.5C10.5 13.3 11.3 13 12 13s1.5.3 2.5.8c1.5.5 2.5 1.5 2.5 2.5" />
            </svg>
            NoteWave
          </div>
        </Link>
      </div>

      <div className="p-3 flex-1 overflow-y-auto">
        <FolderManager 
          folders={folders}
          onRenameFolder={handleUpdateFolder}
          onDeleteFolder={handleDeleteFolder}
          selectedFolder={selectedFolder}
          onSelectFolder={handleSelectFolder}
          onCreateFolderClick={() => {
            setEditFolder(null);
            setShowFolderModal(true);
          }}
        />
      </div>

      {/* Create Folder Modal */}
      {showFolderModal && (
        <CreateFolderModal
          isOpen={showFolderModal}
          onClose={() => {
            setShowFolderModal(false);
            setEditFolder(null);
          }}
          onCreateFolder={handleCreateFolder}
          editFolder={editFolder ?? undefined}
          onUpdateFolder={handleUpdateFolder}
        />
      )}
    </aside>
  );
} 