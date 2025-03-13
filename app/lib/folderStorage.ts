// Client-side storage for folders using localStorage

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

// Get all folders from localStorage
export function getFolders(): Folder[] {
  if (typeof window === 'undefined') {
    return []; // Return empty array if running on server
  }
  
  const foldersJson = localStorage.getItem('folders');
  if (!foldersJson) {
    // Initialize with default "My Notes" folder if none exist
    const defaultFolder: Folder = {
      id: 'default',
      name: 'My Notes',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('folders', JSON.stringify([defaultFolder]));
    return [defaultFolder];
  }
  
  try {
    return JSON.parse(foldersJson) as Folder[];
  } catch (error) {
    console.error('Error parsing folders from localStorage:', error);
    return [];
  }
}

// Save a folder
export function saveFolder(folder: Folder): void {
  const folders = getFolders();
  const existingFolderIndex = folders.findIndex(f => f.id === folder.id);
  
  if (existingFolderIndex >= 0) {
    // Update existing folder
    folders[existingFolderIndex] = folder;
  } else {
    // Add new folder
    folders.push(folder);
  }
  
  localStorage.setItem('folders', JSON.stringify(folders));
}

// Delete a folder by ID
export function deleteFolder(id: string): void {
  const folders = getFolders();
  
  // Make sure there are at least two folders before allowing deletion
  if (folders.length <= 1) {
    console.warn('Cannot delete the last remaining folder');
    return;
  }
  
  const updatedFolders = folders.filter(folder => folder.id !== id);
  localStorage.setItem('folders', JSON.stringify(updatedFolders));
  
  // Update notes that were in this folder to be moved to another folder
  // Find the first folder that isn't the one being deleted
  const firstRemainingFolder = updatedFolders[0]?.id || 'default';
  updateNotesOnFolderDelete(id, firstRemainingFolder);
}

// Get a folder by ID
export function getFolderById(id: string): Folder | undefined {
  const folders = getFolders();
  return folders.find(folder => folder.id === id);
}

// Helper function to update notes when a folder is deleted
function updateNotesOnFolderDelete(folderId: string, newFolderId: string = 'default'): void {
  if (typeof window === 'undefined') return;
  
  const notesJson = localStorage.getItem('notes');
  if (!notesJson) return;
  
  try {
    const notes = JSON.parse(notesJson);
    const updatedNotes = notes.map((note: any) => {
      if (note.folderId === folderId) {
        return { ...note, folderId: newFolderId };
      }
      return note;
    });
    
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  } catch (error) {
    console.error('Error updating notes after folder deletion:', error);
  }
} 