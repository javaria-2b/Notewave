'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@stackframe/stack';
import { StorageService } from './storageService';
import { Note } from './noteStorage';
import { Folder } from './folderStorage';
import { toast } from 'sonner';

// Hook to use storage service with the current user
export function useStorage() {
  const user = useUser();
  const [storageService, setStorageService] = useState<StorageService | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (user) {
      // Initialize storage service with user ID
      const service = new StorageService(user.id);
      setStorageService(service);
      setIsReady(true);
    } else {
      setStorageService(null);
      setIsReady(false);
    }
  }, [user]);

  // Notes methods
  const getNotes = async (): Promise<Note[]> => {
    if (!storageService) return [];
    try {
      return await storageService.getNotes();
    } catch (error) {
      console.error('Failed to get notes:', error);
      toast.error('Failed to load notes. Please try again.');
      return [];
    }
  };

  const saveNote = async (note: Note): Promise<boolean> => {
    if (!storageService) return false;
    try {
      await storageService.saveNote(note);
      return true;
    } catch (error) {
      console.error('Failed to save note:', error);
      toast.error('Failed to save note. Please try again.');
      return false;
    }
  };

  const deleteNote = async (noteId: string): Promise<boolean> => {
    if (!storageService) return false;
    try {
      await storageService.deleteNote(noteId);
      return true;
    } catch (error) {
      console.error('Failed to delete note:', error);
      toast.error('Failed to delete note. Please try again.');
      return false;
    }
  };

  const getNotesByFolder = async (folderId: string): Promise<Note[]> => {
    if (!storageService) return [];
    try {
      return await storageService.getNotesByFolder(folderId);
    } catch (error) {
      console.error('Failed to get notes by folder:', error);
      toast.error('Failed to load folder notes. Please try again.');
      return [];
    }
  };

  // Folders methods
  const getFolders = async (): Promise<Folder[]> => {
    if (!storageService) return [];
    try {
      return await storageService.getFolders();
    } catch (error) {
      console.error('Failed to get folders:', error);
      toast.error('Failed to load folders. Please try again.');
      return [];
    }
  };

  const saveFolder = async (folder: Folder): Promise<boolean> => {
    if (!storageService) return false;
    try {
      await storageService.saveFolder(folder);
      return true;
    } catch (error) {
      console.error('Failed to save folder:', error);
      toast.error('Failed to save folder. Please try again.');
      return false;
    }
  };

  const deleteFolder = async (folderId: string, newFolderId: string = 'default'): Promise<boolean> => {
    if (!storageService) return false;
    try {
      await storageService.deleteFolder(folderId, newFolderId);
      return true;
    } catch (error) {
      console.error('Failed to delete folder:', error);
      toast.error('Failed to delete folder. Please try again.');
      return false;
    }
  };

  // Generic data methods
  const saveData = async (key: string, data: any): Promise<boolean> => {
    if (!storageService) return false;
    try {
      await storageService.saveData(key, data);
      return true;
    } catch (error) {
      console.error(`Failed to save data (${key}):`, error);
      toast.error('Failed to save data. Please try again.');
      return false;
    }
  };

  const getData = async (key: string): Promise<any> => {
    if (!storageService) return null;
    try {
      return await storageService.getData(key);
    } catch (error) {
      console.error(`Failed to get data (${key}):`, error);
      toast.error('Failed to load data. Please try again.');
      return null;
    }
  };

  const deleteData = async (key: string): Promise<boolean> => {
    if (!storageService) return false;
    try {
      await storageService.deleteData(key);
      return true;
    } catch (error) {
      console.error(`Failed to delete data (${key}):`, error);
      toast.error('Failed to delete data. Please try again.');
      return false;
    }
  };

  return {
    isReady,
    getNotes,
    saveNote,
    deleteNote,
    getNotesByFolder,
    getFolders,
    saveFolder,
    deleteFolder,
    saveData,
    getData,
    deleteData,
  };
} 