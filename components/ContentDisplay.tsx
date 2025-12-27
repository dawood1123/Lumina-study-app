
import React from 'react';
import { StudyMode } from '../types';

interface ContentDisplayProps {
  content: string;
  mode: StudyMode;
  topic: string;
  onStartQuiz: () => void;
  isQuizLoading: boolean;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ content, mode, topic, onStartQuiz, isQuizLoading }) => {
  const lines = content.split('\n').filter(line => line.trim());
  
  const renderLine = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-slate-900 font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="prose prose-slate max-w-none">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            mode === StudyMode.EXPLAIN ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {mode}
          </span>
          <h2 className="text-2xl font-bold text-slate-900 m-0">{topic}</h2>
        </div>
        
        {mode !== StudyMode.QUIZ && (
          <button
            onClick={onStartQuiz}
            disabled={isQuizLoading}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-xl font-bold hover:bg-orange-200 transition-all text-sm disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
            </svg>
            {isQuizLoading ? 'Preparing Quiz...' : 'Take Quiz'}
          </button>
        )}
      </div>
      
      <div className="space-y-5">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('###')) {
            return <h3 key={i} className="text-lg font-bold text-slate-900 mt-6 mb-2">{renderLine(trimmed.replace(/^###\s*/, ''))}</h3>;
          }
          const isBullet = trimmed.startsWith('*') || trimmed.startsWith('-') || /^\d+\./.test(trimmed);
          if (isBullet) {
            return (
              <div key={i} className="flex gap-4 items-start pl-2">
                <span className="mt-2.5 w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0"></span>
                <span className="text-slate-700 leading-relaxed">{renderLine(trimmed.replace(/^[*-\d.]\s*/, ''))}</span>
              </div>
            );
          }
          return <p key={i} className="text-slate-700 leading-relaxed text-lg">{renderLine(trimmed)}</p>;
        })}
      </div>

      <div className="mt-10 sm:hidden">
        <button
          onClick={onStartQuiz}
          disabled={isQuizLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg disabled:opacity-50"
        >
          {isQuizLoading ? 'Preparing Quiz...' : 'Test Your Knowledge (Take Quiz)'}
        </button>
      </div>
    </div>
  );
};

export default ContentDisplay;
