
import React, { useState } from 'react';
import Header from './components/Header';
import StudyForm from './components/StudyForm';
import ContentDisplay from './components/ContentDisplay';
import QuizView from './components/QuizView';
import { StudyLevel, StudyMode, StudyResult } from './types';
import { generateStudyContent } from './geminiService';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isQuizTransitioning, setIsQuizTransitioning] = useState(false);
  const [result, setResult] = useState<StudyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Persist these to allow quiz generation from existing results
  const [currentLevel, setCurrentLevel] = useState<StudyLevel>(StudyLevel.BEGINNER);
  const [currentContext, setCurrentContext] = useState<string>('');

  const handleStudyRequest = async (topic: string, level: StudyLevel, mode: StudyMode, context: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setCurrentLevel(level);
    setCurrentContext(context);

    try {
      const response = await generateStudyContent(topic, level, mode, context);
      setResult({
        content: response.text,
        quiz: response.quiz,
        mode,
        topic
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong while reaching the study assistant.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuizFromContent = async () => {
    if (!result) return;
    setIsQuizTransitioning(true);
    setError(null);

    try {
      const response = await generateStudyContent(
        result.topic, 
        currentLevel, 
        StudyMode.QUIZ, 
        currentContext, 
        result.content
      );
      setResult({
        ...result,
        mode: StudyMode.QUIZ,
        quiz: response.quiz
      });
    } catch (err: any) {
      setError(err.message || 'Failed to generate a quiz from this text.');
    } finally {
      setIsQuizTransitioning(false);
    }
  };

  const resetStudy = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <Header />

      <main className="max-w-2xl mx-auto">
        {!result && !isLoading && (
          <StudyForm onSubmit={handleStudyRequest} isLoading={isLoading} />
        )}

        {(isLoading || isQuizTransitioning) && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-indigo-50 animate-pulse">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {isQuizTransitioning ? "Creating a custom quiz from the text..." : "Analyzing your request..."}
            </h3>
            <p className="text-slate-500">Lumina is tailoring the content to your specific needs.</p>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 mb-8 text-center">
            <p className="text-rose-700 font-medium mb-4">{error}</p>
            <button 
              onClick={resetStudy}
              className="px-6 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {result && !isLoading && !isQuizTransitioning && (
          <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 p-8 border border-indigo-50 animate-in fade-in zoom-in duration-300">
            {result.mode === StudyMode.QUIZ && result.quiz ? (
              <QuizView questions={result.quiz} onReset={resetStudy} />
            ) : (
              <div>
                <ContentDisplay 
                  content={result.content} 
                  mode={result.mode} 
                  topic={result.topic} 
                  onStartQuiz={handleStartQuizFromContent}
                  isQuizLoading={isQuizTransitioning}
                />
                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={handleStartQuizFromContent}
                    className="flex items-center gap-2 px-8 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 hover:-translate-y-0.5 transition-all shadow-lg w-full sm:w-auto justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                    </svg>
                    Attempt Quiz Now
                  </button>
                  <button
                    onClick={resetStudy}
                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 hover:-translate-y-0.5 transition-all shadow-lg w-full sm:w-auto justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 0118 0z"></path>
                    </svg>
                    New Topic
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="mt-20 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Lumina AI Labs. Personalized educational intelligence.</p>
      </footer>
    </div>
  );
};

export default App;
