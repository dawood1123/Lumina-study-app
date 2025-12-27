
import React, { useState } from 'react';
import { StudyLevel, StudyMode } from '../types';

interface StudyFormProps {
  onSubmit: (topic: string, level: StudyLevel, mode: StudyMode, context: string) => void;
  isLoading: boolean;
}

const StudyForm: React.FC<StudyFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [level, setLevel] = useState<StudyLevel>(StudyLevel.BEGINNER);

  const handleModeClick = (mode: StudyMode) => {
    if (!topic.trim()) return;
    onSubmit(topic, level, mode, context);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8 mb-8 border border-indigo-50">
      <div className="mb-4">
        <label htmlFor="topic" className="block text-sm font-semibold text-slate-700 mb-2">
          What are you studying today?
        </label>
        <input
          type="text"
          id="topic"
          placeholder="e.g., Photosynthesis, Calculus, Roman History..."
          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400 font-medium"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="context" className="block text-sm font-semibold text-slate-700 mb-2">
          Add specific instructions or focus areas <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="context"
          placeholder="e.g., 'Explain using numeric examples', 'Focus on real-world applications', 'Keep it very technical'..."
          className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400 text-sm h-24 resize-none"
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Target Level</label>
        <div className="grid grid-cols-2 gap-4">
          {Object.values(StudyLevel).map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`py-3 px-4 rounded-xl font-medium transition-all ${
                level === l
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-semibold text-slate-700">Select a Mode to Start</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            disabled={isLoading || !topic.trim()}
            onClick={() => handleModeClick(StudyMode.EXPLAIN)}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-white border-2 border-indigo-500 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            Explain
          </button>
          <button
            disabled={isLoading || !topic.trim()}
            onClick={() => handleModeClick(StudyMode.SUMMARY)}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-white border-2 border-emerald-500 text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            Summary
          </button>
          <button
            disabled={isLoading || !topic.trim()}
            onClick={() => handleModeClick(StudyMode.QUIZ)}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-white border-2 border-orange-500 text-orange-600 rounded-2xl font-bold hover:bg-orange-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyForm;
