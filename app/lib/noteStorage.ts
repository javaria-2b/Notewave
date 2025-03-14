// Note interface definition - used throughout the application

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
  folderId?: string; // Track which folder the note belongs to
}

// Note: All storage operations have been moved to Redis via StorageService
// This file now only exports the Note interface
// Use the useStorage hook for all note operations 