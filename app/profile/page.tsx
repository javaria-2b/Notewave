'use client';

import { useState, useEffect } from 'react';
import { useUser, useStackApp, UserButton } from "@stackframe/stack";
import { useStorage } from '../lib/useStorage';

export default function ProfilePage() {
  const user = useUser({ or: "redirect" });
  const app = useStackApp();
  const storage = useStorage();
  const [displayName, setDisplayName] = useState('');
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on component mount
  useEffect(() => {
    if (storage.isReady) {
      loadUserData();
    }
  }, [storage.isReady]);

  // Load user data from storage
  const loadUserData = async () => {
    setIsLoading(true);
    try {
      // Get user preferences from storage
      const preferences = await storage.getData('userPreferences');
      if (preferences) {
        setUserPreferences(preferences);
      }
      
      // Set display name from user object
      setDisplayName(user.displayName || '');
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save user preferences to storage
  const saveUserPreferences = async (theme: string) => {
    try {
      const preferences = {
        ...(userPreferences || {}),
        theme,
        lastUpdated: new Date().toISOString(),
      };
      
      await storage.saveData('userPreferences', preferences);
      setUserPreferences(preferences);
      
      // Show success message
      alert('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Error saving preferences. Please try again.');
    }
  };

  // Update user display name
  const updateDisplayName = async () => {
    try {
      await user.update({ displayName });
      alert('Display name updated successfully!');
    } catch (error) {
      console.error('Error updating display name:', error);
      alert('Error updating display name. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">User Profile</h1>
          <UserButton />
        </div>
        
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-medium">{user.primaryEmail}</p>
            </div>
            
            <div>
              <p className="text-gray-600 dark:text-gray-400">User ID</p>
              <p className="font-medium">{user.id}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-grow">
                <label htmlFor="displayName" className="block text-gray-600 dark:text-gray-400 mb-1">
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <button
                onClick={updateDisplayName}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md self-end"
              >
                Update Name
              </button>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Theme</p>
              <div className="flex gap-3">
                <button
                  onClick={() => saveUserPreferences('light')}
                  className={`px-4 py-2 rounded-md ${
                    userPreferences?.theme === 'light'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => saveUserPreferences('dark')}
                  className={`px-4 py-2 rounded-md ${
                    userPreferences?.theme === 'dark'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => saveUserPreferences('system')}
                  className={`px-4 py-2 rounded-md ${
                    userPreferences?.theme === 'system' || !userPreferences?.theme
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  System
                </button>
              </div>
            </div>
            
            {userPreferences?.lastUpdated && (
              <p className="text-sm text-gray-500">
                Last updated: {new Date(userPreferences.lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={() => user.signOut()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
} 