import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-20 animate-fadeIn">
      <Compass className="w-16 h-16 text-sky-400 mx-auto mb-4 animate-spin" style={{ animationDuration: '8s' }} />
      <h1 className="text-3xl font-extrabold text-white mb-2">404 - Off the Map</h1>
      <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
        The destination you are looking for hasn't been mapped yet.
      </p>
      <Link to="/dashboard" className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-md transition-all">
        Return to Dashboard
      </Link>
    </div>
  );
};
