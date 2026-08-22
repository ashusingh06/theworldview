import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-zinc-900 bg-zinc-950 py-4 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <p>© {new Date().getFullYear()} TheWorldView</p>
          <p className="text-zinc-600 text-[11px]">Travel Planning Application</p>
        </div>
      </footer>
    </div>
  );
};
