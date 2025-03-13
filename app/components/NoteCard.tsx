'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import QuizGenerator from './QuizGenerator';
import MindMapGenerator from './MindMapGenerator';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import MoveToFolderModal from './MoveToFolderModal';
import { Folder } from '../lib/folderStorage';

interface NoteCardProps {
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
  onAddToFolder?: () => void;
  onCopyText?: () => void;
  onRecord?: () => void;
  onDelete?: (id: string) => void;
  onMoveToFolder?: (folderId: string) => void;
  folders?: Folder[];
}

export default function NoteCard({
  id,
  title,
  description,
  date,
  isRtl = false,
  content,
  aiExplanation,
  aiContext,
  aiSummary,
  folderId = 'default',
  onAddToFolder,
  onCopyText,
  onRecord,
  onDelete,
  onMoveToFolder,
  folders
}: NoteCardProps) {
  const router = useRouter();
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showMindMapModal, setShowMindMapModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);

  const handleCardClick = () => {
    if (isDeleting) return; // Prevent navigation if deletion is in progress
    router.push(`/note/${id}`);
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = () => {
    if (onDelete) {
      setIsDeleting(true);
      setShowDeleteConfirm(false);
      
      // Add a slight delay to show deletion state before actual deletion
      setTimeout(() => {
        onDelete(id);
      }, 300);
    }
  };

  return (
    <>
      <div 
        className={`border border-gray-300 rounded-md py-4 px-10 hover:bg-gray-50 cursor-pointer transition-colors bg-white relative ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
        onClick={handleCardClick}
      >
        {isDeleting && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-md z-10">
            <svg className="animate-spin h-6 w-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        <div className={`flex flex-col ${isRtl ? 'font-arabic' : ''}`}>
          <h3 className="font-semibold mb-1 text-black text-base">{title}</h3>
          <p className="text-gray-700 text-sm mb-2">{description}</p>
          <div className="flex items-center justify-end w-full">
            <div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
                  if (onAddToFolder) onAddToFolder();
            }} 
                className="text-sm flex items-center gap-1 text-black hover:text-gray-800 border border-gray-300 px-2 py-0.5 rounded-md mr-3"
                title="Add to folder"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
                Add folder
          </button>
            </div>
            <div className="text-sm text-black font-medium">{date}</div>
          </div>
          
          {/* Delete button */}
          <button 
            onClick={handleDeleteClick}
            className="absolute top-2 right-2 p-1 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-full"
            title="Delete note"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-md w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-black">{title}</h2>
              <button 
                onClick={() => setShowNoteModal(false)}
                className="text-gray-600 hover:text-black"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1">
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm text-gray-600">{date}</div>
                <div className="flex items-center">
                  <span className="text-xs bg-gray-200 text-black px-2 py-1 rounded-full">
                    {folderId === 'default' ? 'My Notes' : 'In folder'}
                  </span>
                </div>
              </div>
              
              <div className={`whitespace-pre-wrap text-base ${isRtl ? 'font-arabic text-right' : ''}`}>
                {content || description}
              </div>
            
            {aiExplanation && (
                <div className="mt-6 p-4 bg-purple-50 rounded-md">
                  <h3 className="font-semibold text-purple-800 mb-2">AI Explanation</h3>
                  <div className="text-sm">{aiExplanation}</div>
              </div>
            )}
            
            {aiContext && (
                <div className="mt-4 p-4 bg-purple-50 rounded-md">
                  <h3 className="font-semibold text-purple-800 mb-2">Additional Context</h3>
                  <div className="text-sm">{aiContext}</div>
                </div>
              )}
              
              {aiSummary && (
                <div className="mt-4 p-4 bg-purple-50 rounded-md">
                  <h3 className="font-semibold text-purple-800 mb-2">Summary</h3>
                  <div className="text-sm">{aiSummary}</div>
              </div>
            )}
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-between">
              <div className="flex gap-2">
                <button 
                  className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm"
                  onClick={() => setShowQuizModal(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                  </svg>
                  Generate quiz
                </button>
                <button 
                  className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm"
                  onClick={() => setShowMindMapModal(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  Generate mind map
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  Delete note
                </button>
                {onMoveToFolder && (
                  <button 
                    onClick={() => {
                      setShowFolderModal(true);
                    }}
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44L10.5 3.75z" />
                    </svg>
                    Move to folder
                  </button>
                )}
              </div>
              <button 
                onClick={() => setShowNoteModal(false)}
                className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuizModal && (
        <QuizGenerator 
          noteContent={content || ''}
          noteTitle={title}
          onClose={() => setShowQuizModal(false)}
        />
      )}

      {/* Mind Map Modal */}
      {showMindMapModal && (
        <MindMapGenerator 
          noteContent={content || ''}
          noteTitle={title}
          onClose={() => setShowMindMapModal(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmationModal
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          title="Delete Note"
          message="Are you sure you want to delete this note? This action cannot be undone."
        />
      )}

      {/* Move to Folder Modal */}
      {showFolderModal && folders && onMoveToFolder && (
        <MoveToFolderModal
          folders={folders}
          onClose={() => setShowFolderModal(false)}
          onSelect={onMoveToFolder}
        />
      )}
    </>
  );
} 