import React from 'react';
import Sidebar from '../components/Sidebar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      <Sidebar />
      
      <main className="flex-grow overflow-x-hidden w-full">
        {children}
      </main>
    </div>
  );
} 