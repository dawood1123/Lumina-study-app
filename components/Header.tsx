
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 text-center">
      <div className="inline-flex items-center justify-center p-3 mb-4 bg-indigo-100 rounded-2xl">
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Lumina Study</h1>
      <p className="text-slate-500 text-lg max-w-md mx-auto">Your AI-powered companion for mastering any academic topic.</p>
    </header>
  );
};

export default Header;
