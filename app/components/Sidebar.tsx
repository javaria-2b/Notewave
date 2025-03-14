'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import CreateFolderModal from './CreateFolderModal';
import { Folder } from '../lib/folderStorage';
import FolderManager from './FolderManager';
import { UserButton } from '@stackframe/stack';
import { useStorage } from '../lib/useStorage';

// Custom icon component for the UserButton extra item
const CustomIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3v18" />
    <path d="M3 12h18" />
  </svg>
);

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isReady, getFolders, saveFolder, deleteFolder } = useStorage();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [editFolder, setEditFolder] = useState<{id: string, name: string} | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to refresh folders from storage
  const refreshFolders = async () => {
    if (!isReady) return;
    
    const storedFolders = await getFolders();
    setFolders(storedFolders);
  };

  // Load data on component mount and when storage is ready
  useEffect(() => {
    if (isReady) {
      refreshFolders();
    }
  }, [isReady]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleCreateFolder = async (name: string) => {
    if (!isReady) return;
    
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name: name,
      createdAt: new Date().toISOString()
    };
    await saveFolder(newFolder);
    refreshFolders();
  };

  const handleUpdateFolder = async (id: string, name: string) => {
    if (!isReady) return;
    
    const folder = folders.find(f => f.id === id);
    if (folder) {
      const updatedFolder: Folder = {
        ...folder,
        name: name
      };
      await saveFolder(updatedFolder);
      refreshFolders();
    }
  };

  const handleDeleteFolder = async (id: string) => {
    if (!isReady) return;
    
    await deleteFolder(id);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button - only visible on small screens */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={toggleMobileMenu}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {isMobileMenuOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      <aside className={`fixed md:static w-60 h-screen border-r border-gray-300 flex flex-col bg-white transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'left-0' : '-left-60'} md:left-0 z-40`}>
        <div className="p-4 border-b border-gray-300 text-black flex justify-between items-center">
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

        {/* User profile section at the bottom */}
        <div className="p-4 border-t border-gray-300">
          <UserButton
            showUserInfo={true}
            colorModeToggle={() => { console.log("color mode toggle clicked") }}
            // extraItems={[{
            //   text: 'Custom Action',
            //   icon: <CustomIcon />,
            //   onClick: () => console.log('Custom action clicked')
            // }]}
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

      {/* Overlay for mobile - only visible when mobile menu is open */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
} 