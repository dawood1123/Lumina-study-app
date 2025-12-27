
import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizViewProps {
  questions: QuizQuestion[];
  onReset: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    if (index === currentQuestion.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="text-center py-10">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-indigo-600">{score}/{questions.length}</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Quiz Complete!</h3>
        <p className="text-slate-600 mb-8">
          {score === questions.length ? "Perfect score! You're a master." : "Great effort! Keep practicing to improve."}
        </p>
        <button
          onClick={onReset}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg"
        >
          New Topic
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Question {currentIndex + 1} of {questions.length}</span>
        <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 leading-tight">
        {currentQuestion.question}
      </h3>

      <div className="space-y-3">
        {currentQuestion.options.map((option, idx) => {
          let stateStyles = "bg-white border-slate-200 text-slate-800 hover:border-indigo-300 shadow-sm";
          
          if (isAnswered) {
            if (idx === currentQuestion.correctIndex) {
              stateStyles = "bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-100";
            } else if (idx === selectedAnswer) {
              stateStyles = "bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-100";
            } else {
              stateStyles = "bg-slate-50 border-slate-100 text-slate-400 opacity-70";
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleAnswer(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all font-semibold ${stateStyles}`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm ${
                  isAnswered && idx === currentQuestion.correctIndex ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 mt-6">
          <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 mb-6">
            <p className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Quick Fact Check:
            </p>
            <p className="text-sm text-indigo-900/80 leading-relaxed font-medium">{currentQuestion.explanation}</p>
          </div>
          <button
            onClick={handleNext}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98]"
          >
            {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizView;
