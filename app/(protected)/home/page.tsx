'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import NoteCard from '../../components/NoteCard';
import CreateFolderModal from '../../components/CreateFolderModal';
// Audio functionality temporarily removed
// import AudioRecorder from '../../components/AudioRecorder';
// import AudioUploader from '../../components/AudioUploader';
import NoteEditor from '../../components/NoteEditor';
import TranscriptionEditor from '../../components/TranscriptionEditor';
import { NoteEnhancer } from '../../components/NoteEnhancer';
import { Note as NoteType } from '../../lib/noteStorage';
import { Folder } from '../../lib/folderStorage';
import MoveToFolderModal from '../../components/MoveToFolderModal';
import PDFUploader from '../../components/PDFUploader';
import YouTubeImporter from '../../components/YouTubeImporter';
import { useStorage } from '../../lib/useStorage';

// Mock data for initial notes if none exist
const mockNotes = [
  {
    id: '1',
    title: 'Welcome to Note0: Your Study and Work Companion',
    description: 'A powerful tool for transforming recordings and PDFs into organized notes using advanced AI techniques.',
    date: '09 Nov 2024, 11:08 PM',
    folderId: 'default'
  },
  {
    id: '2',
    title: 'سر طور پر سر خبر',
    description: 'ایک خوبصورت شعر کی تلاش اور مذاق کے لئے تیار کیا گیا',
    date: '07 Mar 2025, 10:43 PM',
    isRtl: true,
    folderId: 'default'
  }
];

interface Note {
  id: string;
  title: string;
  description: string;
  date: string;
  isRtl?: boolean;
  content?: string;
  aiExplanation?: string;
  aiContext?: string;
  aiSummary?: string;
  folderId?: string;
}

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const folderParam = searchParams.get('folder');
  const { 
    isReady, 
    getNotes, 
    saveNote: saveNoteToStorage, 
    deleteNote, 
    getNotesByFolder, 
    getFolders, 
    saveFolder, 
    deleteFolder 
  } = useStorage();
  
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showMoveToFolderModal, setShowMoveToFolderModal] = useState(false);
  const [selectedNoteForMove, setSelectedNoteForMove] = useState<string | null>(null);
  // Audio functionality temporarily removed
  // const [showRecorder, setShowRecorder] = useState(false);
  // const [showAudioUploader, setShowAudioUploader] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [showTranscriptionEditor, setShowTranscriptionEditor] = useState(false);
  const [showNoteEnhancer, setShowNoteEnhancer] = useState(false);
  const [showPDFUploader, setShowPDFUploader] = useState(false);
  const [showYouTubeImporter, setShowYouTubeImporter] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>(folderParam || 'all');
  const [editFolder, setEditFolder] = useState<{id: string, name: string} | null>(null);
  const [transcriptionData, setTranscriptionData] = useState<{
    timestamp?: string;
    subtitleCreator?: string;
    content?: string;
  } | null>(null);

  // Function to refresh notes from storage
  const refreshNotes = async () => {
    if (!isReady) return;
    
    let storedNotes;
    if (selectedFolder === 'all') {
      storedNotes = await getNotes();
    } else {
      storedNotes = await getNotesByFolder(selectedFolder);
    }
    
    if (storedNotes.length === 0 && notes.length === 0 && selectedFolder === 'all') {
      setNotes(mockNotes);
    } else {
      setNotes(storedNotes);
    }
  };

  // Function to refresh folders from storage
  const refreshFolders = async () => {
    if (!isReady) return;
    
    const storedFolders = await getFolders();
    setFolders(storedFolders);
  };

  // Update selectedFolder when URL param changes
  useEffect(() => {
    if (folderParam) {
      setSelectedFolder(folderParam);
    } else {
      setSelectedFolder('all');
    }
  }, [folderParam]);

  // Load data on component mount and when storage is ready
  useEffect(() => {
    if (isReady) {
      refreshFolders();
      refreshNotes();
    }
  }, [isReady]);

  // Refresh notes when selected folder changes
  useEffect(() => {
    if (isReady) {
      refreshNotes();
    }
  }, [selectedFolder, isReady]);

  const handleMoveToFolder = async (noteId: string, folderId?: string) => {
    if (!isReady) return;
    
    if (folderId) {
      // If folderId is provided, move the note directly
      // First get the note
      const allNotes = await getNotes();
      const noteToMove = allNotes.find(note => note.id === noteId);
      
      if (noteToMove) {
        // Update the note with the new folder ID
        const updatedNote = { ...noteToMove, folderId };
        await saveNoteToStorage(updatedNote);
        refreshNotes();
      }
    } else {
      // Otherwise, show the modal for selection
      setSelectedNoteForMove(noteId);
      setShowMoveToFolderModal(true);
    }
  };

  const handleSaveNote = async (noteData: {
    title: string;
    content: string;
    aiExplanation?: string;
    aiContext?: string;
    aiSummary?: string;
  }) => {
    if (!isReady) return;
    
    const newNote = {
      id: Date.now().toString(),
      title: noteData.title,
      description: noteData.content.substring(0, 100) + (noteData.content.length > 100 ? '...' : ''),
      date: new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      content: noteData.content,
      aiExplanation: noteData.aiExplanation,
      aiContext: noteData.aiContext,
      aiSummary: noteData.aiSummary,
      folderId: selectedFolder === 'all' ? 'default' : selectedFolder
    };
    
    // Save to storage and update state
    await saveNoteToStorage(newNote);
    refreshNotes();
    setShowNoteEditor(false);
    setShowTranscriptionEditor(false);
    setShowNoteEnhancer(false);
  };

  const handleProcessTranscription = () => {
    // Example transcription data from the image
    setTranscriptionData({
      timestamp: '00:00:00 - 00:00:05',
      subtitleCreator: 'Nicolai Winther',
      content: 'This document contains the transcription of a video segment, specifically the opening credits, which includes the name of the person responsible for the subtitles.'
    });
    setShowTranscriptionEditor(true);
  };

  const handleDeleteNote = async (id: string) => {
    if (!isReady) return;
    
    await deleteNote(id);
    refreshNotes();
    
    // Show success notification
    const successMessage = 'Note deleted successfully';
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-md shadow-lg z-50 text-sm';
    notification.textContent = successMessage;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
    
    // Refresh the page to ensure all components are updated
    setTimeout(() => {
      refreshNotes();
      router.refresh();
    }, 300);
  };

  // Function to handle folder creation
  const handleCreateFolder = async (name: string) => {
    if (!isReady) return;
    
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name: name,
      createdAt: new Date().toISOString()
    };
    await saveFolder(newFolder);
    refreshFolders();
    setShowFolderModal(false);
  };

  // Function to handle folder update/rename
  const handleUpdateFolder = async (id: string, name: string) => {
    if (!isReady) return;
    
    const folder = folders.find(f => f.id === id);
    if (folder) {
      const updatedFolder = { ...folder, name };
      await saveFolder(updatedFolder);
      refreshFolders();
      setShowFolderModal(false);
      setEditFolder(null);
    }
  };

  // Function to handle PDF upload and note creation
  const handleSaveFromPDF = async (title: string, content: string) => {
    if (!isReady) return;
    
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title,
      description: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      content,
      folderId: selectedFolder === 'all' ? 'default' : selectedFolder
    };
    
    await saveNoteToStorage(newNote);
    refreshNotes();
    setShowPDFUploader(false);
    
    // Show success notification
    const successMessage = 'Note created from PDF successfully';
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-md shadow-lg z-50 text-sm';
    notification.textContent = successMessage;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  // Function to handle YouTube video import and note creation
  const handleSaveFromYouTube = (title: string, content: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title,
      description: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      content,
      folderId: selectedFolder === 'all' ? 'default' : selectedFolder
    };
    
    saveNoteToStorage(newNote);
    refreshNotes();
    setShowYouTubeImporter(false);
    
    // Show success notification
    const successMessage = 'Note created from YouTube video successfully';
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-md shadow-lg z-50 text-sm';
    notification.textContent = successMessage;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center mb-4">
        <Link href="/home" className="text-sm text-gray-600 hover:underline">All notes</Link>
        {selectedFolder !== 'all' && (
          <>
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-sm text-black font-medium">
              {folders.find(f => f.id === selectedFolder)?.name || 'Folder'}
            </span>
          </>
        )}
      </div>
      
      {/* New Note Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">New note</h1>
        <p className="text-gray-600 mb-4">Record your thoughts, ideas, and tasks in a note.</p>
        
        <div className="flex flex-wrap gap-2">
          {/* Audio functionality temporarily disabled */}
          <button 
            className="btn-secondary flex items-center gap-2 opacity-50 cursor-not-allowed"
            title="Audio functionality temporarily disabled"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
            Record audio
          </button>
          <button 
            onClick={() => setShowNoteEditor(true)}
            className="btn-primary flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Write note
          </button>
          <button 
            onClick={() => setShowNoteEnhancer(true)}
            className="btn-primary flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            AI Enhance
          </button>
          <button 
            onClick={handleProcessTranscription}
            className="btn-primary flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 0h-17.25m20.25 0A2.25 2.25 0 0021.75 4.5H2.25A2.25 2.25 0 000 6.75v10.5A2.25 2.25 0 002.25 19.5h19.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25z" />
            </svg>
            Process transcription
          </button>
          <button 
            className="btn-secondary flex items-center gap-2 opacity-50 cursor-not-allowed"
            title="Audio functionality temporarily disabled"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            Upload audio
          </button>
          <button 
            onClick={() => setShowPDFUploader(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            Upload PDF
          </button>
          <button 
            onClick={() => setShowYouTubeImporter(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            YouTube video
          </button>
        </div>
      </div>
      
      {/* Notes Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {selectedFolder === 'all' 
              ? 'All notes' 
              : folders.find(f => f.id === selectedFolder)?.name || 'Notes'}
          </h2>
          
          {/* Add Folder Button */}
          <button 
            onClick={() => setShowFolderModal(true)}
            className="flex items-center gap-1 text-sm text-black hover:text-gray-800 px-2 py-1 rounded-md hover:bg-gray-100 border border-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add folder
          </button>
        </div>
        
        {notes.length === 0 && (
          <div className="p-6 text-center border border-gray-300 rounded-md bg-gray-50">
            <p className="text-gray-600">No notes in this folder. Create a new note to get started!</p>
          </div>
        )}
        
        <div className="space-y-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              title={note.title}
              description={note.description}
              date={note.date}
              isRtl={note.isRtl}
              content={note.content}
              aiExplanation={note.aiExplanation}
              aiContext={note.aiContext}
              aiSummary={note.aiSummary}
              folderId={note.folderId}
              onAddToFolder={() => {
                setSelectedNoteForMove(note.id);
                setShowMoveToFolderModal(true);
              }}
              onCopyText={() => console.log('Copy text')}
              onRecord={() => alert('Audio functionality is temporarily disabled')}
              onDelete={handleDeleteNote}
              onMoveToFolder={(folderId) => handleMoveToFolder(note.id, folderId)}
              folders={folders}
            />
          ))}
        </div>
      </div>

      {/* Move to folder modal */}
      {showMoveToFolderModal && selectedNoteForMove && (
        <MoveToFolderModal
          folders={folders}
          onClose={() => {
            setShowMoveToFolderModal(false);
            setSelectedNoteForMove(null);
          }}
          onSelect={(folderId) => {
            handleMoveToFolder(selectedNoteForMove, folderId);
            setShowMoveToFolderModal(false);
            setSelectedNoteForMove(null);
          }}
          currentFolderId={notes.find(n => n.id === selectedNoteForMove)?.folderId}
        />
      )}
      
      {/* Audio functionality temporarily removed */}
      
      {showNoteEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="max-w-4xl w-full bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">New Note</h2>
            <NoteEditor onSave={handleSaveNote} />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowNoteEditor(false)}
                className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-100 text-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showTranscriptionEditor && transcriptionData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="max-w-4xl w-full bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Process Transcription</h2>
            <TranscriptionEditor 
              onSave={handleSaveNote}
              initialData={transcriptionData}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowTranscriptionEditor(false)}
                className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-100 text-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showNoteEnhancer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="max-w-4xl w-full bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">AI-Enhanced Note</h2>
            <NoteEnhancer onSave={handleSaveNote} />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowNoteEnhancer(false)}
                className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-100 text-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showPDFUploader && (
        <PDFUploader
          onClose={() => setShowPDFUploader(false)}
          onSave={handleSaveFromPDF}
        />
      )}
      
      {showYouTubeImporter && (
        <YouTubeImporter
          onClose={() => setShowYouTubeImporter(false)}
          onSave={handleSaveFromYouTube}
        />
      )}
      
      {/* Folder creation modal */}
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
    </div>
  );
} 