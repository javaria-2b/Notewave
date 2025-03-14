// Folder interface definition - used throughout the application

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

// Note: All storage operations have been moved to Redis via StorageService
// This file now only exports the Folder interface
// Use the useStorage hook for all folder operations 