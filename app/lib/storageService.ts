'use client';

import { Note } from './noteStorage';
import { Folder } from './folderStorage';

// Check if code is running on the client side
const isClient = typeof window !== 'undefined';

// Storage service that uses API routes for Redis storage
export class StorageService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  // Save data to storage
  async saveData(key: string, data: any): Promise<void> {
    if (isClient) {
      // Always use API route when on client
      try {
        console.log(`Attempting to save data to storage: ${key}`);
        const response = await fetch('/api/storage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key, data }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to save data: ${response.statusText} - ${errorText}`);
        }
        console.log(`Successfully saved data to storage: ${key}`);
      } catch (error) {
        console.error('Error saving data to storage:', error);
        throw error;
      }
    } else {
      // Server-side - can't save data
      console.warn('Attempted to save data on server side, operation not supported');
    }
  }

  // Get data from storage
  async getData(key: string): Promise<any> {
    if (isClient) {
      // Always use API route when on client
      try {
        console.log(`Attempting to get data from storage: ${key}`);
        const response = await fetch(`/api/storage?key=${encodeURIComponent(key)}`, {
          method: 'GET',
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to get data: ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        console.log(`Successfully retrieved data from storage: ${key}`);
        return result.data;
      } catch (error) {
        console.error('Error getting data from storage:', error);
        throw error;
      }
    }
    return null;
  }

  // Delete data from storage
  async deleteData(key: string): Promise<void> {
    if (isClient) {
      // Always use API route when on client
      try {
        console.log(`Attempting to delete data from storage: ${key}`);
        const response = await fetch(`/api/storage?key=${encodeURIComponent(key)}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete data: ${response.statusText} - ${errorText}`);
        }
        console.log(`Successfully deleted data from storage: ${key}`);
      } catch (error) {
        console.error('Error deleting data from storage:', error);
        throw error;
      }
    } else {
      // Server-side - can't delete data
      console.warn('Attempted to delete data on server side, operation not supported');
    }
  }

  // Notes specific methods
  async getNotes(): Promise<Note[]> {
    const notes = await this.getData('notes');
    return notes || [];
  }

  async saveNote(note: Note): Promise<void> {
    // Set default folderId if not provided
    if (!note.folderId) {
      note.folderId = 'default';
    }
    
    // Get existing notes
    const notes = await this.getNotes();
    
    // Check if note already exists
    const existingNoteIndex = notes.findIndex(n => n.id === note.id);
    
    let updatedNotes;
    if (existingNoteIndex >= 0) {
      // Update existing note
      updatedNotes = [...notes];
      updatedNotes[existingNoteIndex] = note;
    } else {
      // Add new note to the beginning of the array
      updatedNotes = [note, ...notes];
    }
    
    // Save to storage
    await this.saveData('notes', updatedNotes);
  }

  async deleteNote(noteId: string): Promise<void> {
    const notes = await this.getNotes();
    const updatedNotes = notes.filter(note => note.id !== noteId);
    await this.saveData('notes', updatedNotes);
  }

  async getNotesByFolder(folderId: string): Promise<Note[]> {
    const notes = await this.getNotes();
    return notes.filter(note => note.folderId === folderId);
  }

  // Folders specific methods
  async getFolders(): Promise<Folder[]> {
    const folders = await this.getData('folders');
    
    if (!folders || folders.length === 0) {
      // Initialize with default "My Notes" folder if none exist
      const defaultFolder: Folder = {
        id: 'default',
        name: 'My Notes',
        createdAt: new Date().toISOString()
      };
      await this.saveData('folders', [defaultFolder]);
      return [defaultFolder];
    }
    
    return folders;
  }

  async saveFolder(folder: Folder): Promise<void> {
    const folders = await this.getFolders();
    const existingFolderIndex = folders.findIndex(f => f.id === folder.id);
    
    if (existingFolderIndex >= 0) {
      // Update existing folder
      folders[existingFolderIndex] = folder;
    } else {
      // Add new folder
      folders.push(folder);
    }
    
    await this.saveData('folders', folders);
  }

  // Delete a folder and move its notes to another folder
  async deleteFolder(folderId: string, newFolderId: string = 'default'): Promise<void> {
    // Get all folders
    const folders = await this.getFolders();
    
    // Make sure there are at least two folders before allowing deletion
    if (folders.length <= 1) {
      console.warn('Cannot delete the last remaining folder');
      return;
    }
    
    // Remove the folder
    const updatedFolders = folders.filter(folder => folder.id !== folderId);
    await this.saveData('folders', updatedFolders);
    
    // Update notes that were in this folder to be moved to another folder
    const notes = await this.getNotes();
    const updatedNotes = notes.map(note => {
      if (note.folderId === folderId) {
        return { ...note, folderId: newFolderId };
      }
      return note;
    });
    
    // Save updated notes
    await this.saveData('notes', updatedNotes);
  }
} 