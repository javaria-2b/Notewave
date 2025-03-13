// Client-side storage for notes using localStorage

export interface Note {
  id: string;
  title: string;
  description: string;
  date: string;
  isRtl?: boolean;
  content?: string;
  aiExplanation?: string;
  aiContext?: string;
  aiSummary?: string;
  folderId?: string; // Add folderId to track which folder the note belongs to
}

// Save a note to localStorage
export function saveNote(note: Note): void {
  // Set default folderId if not provided
  if (!note.folderId) {
    note.folderId = 'default';
  }
  
  // Get existing notes
  const notes = getNotes();
  
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
  
  // Save to localStorage
  localStorage.setItem('notes', JSON.stringify(updatedNotes));
}

// Get all notes from localStorage
export function getNotes(): Note[] {
  if (typeof window === 'undefined') {
    return []; // Return empty array if running on server
  }
  
  const notesJson = localStorage.getItem('notes');
  if (!notesJson) {
    return [];
  }
  
  try {
    return JSON.parse(notesJson) as Note[];
  } catch (error) {
    console.error('Error parsing notes from localStorage:', error);
    return [];
  }
}

// Get notes by folder ID
export function getNotesByFolder(folderId: string): Note[] {
  const notes = getNotes();
  if (!folderId || folderId === 'all') {
    return notes;
  }
  return notes.filter(note => note.folderId === folderId);
}

// Move a note to a different folder
export function moveNoteToFolder(noteId: string, folderId: string): void {
  const notes = getNotes();
  const noteIndex = notes.findIndex(note => note.id === noteId);
  
  if (noteIndex >= 0) {
    notes[noteIndex] = { ...notes[noteIndex], folderId };
    localStorage.setItem('notes', JSON.stringify(notes));
  }
}

// Delete a note by ID
export function deleteNote(id: string): void {
  const notes = getNotes();
  const updatedNotes = notes.filter(note => note.id !== id);
  localStorage.setItem('notes', JSON.stringify(updatedNotes));
}

// Update an existing note
export function updateNote(updatedNote: Note): void {
  const notes = getNotes();
  const updatedNotes = notes.map(note => 
    note.id === updatedNote.id ? updatedNote : note
  );
  localStorage.setItem('notes', JSON.stringify(updatedNotes));
}

// Get a single note by ID
export function getNoteById(id: string): Note | undefined {
  const notes = getNotes();
  return notes.find(note => note.id === id);
} 