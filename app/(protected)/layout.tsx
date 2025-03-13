import React from 'react';
import Sidebar from '../components/Sidebar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen">
      <div className="flex-shrink-0 w-60">
        <Sidebar />
      </div>
      <div className="flex-grow overflow-x-hidden">
        {children}
      </div>
    </div>
  );
} 