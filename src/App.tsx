import React, { useState, useEffect } from 'react';
import { Brain, Upload, Trophy, Home } from 'lucide-react';
import { QuestionSet, QuizState, QuizResult } from './types';
import QuestionSetUpload from './components/QuestionSetUpload';
import QuestionSetList from './components/QuestionSetList';
import QuizInterface from './components/QuizInterface';
import QuizResults from './components/QuizResults';
import ResultsHistory from './components/ResultsHistory';

type AppView = 'home' | 'upload' | 'quiz' | 'results' | 'history';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [currentQuestionSet, setCurrentQuestionSet] = useState<QuestionSet | null>(null);
  const [currentQuizState, setCurrentQuizState] = useState<QuizState | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedQuestionSets = localStorage.getItem('quizApp_questionSets');
    const savedResults = localStorage.getItem('quizApp_results');
    
    if (savedQuestionSets) {
      const parsedSets = JSON.parse(savedQuestionSets);
      // Convert date strings back to Date objects
      const setsWithDates: QuestionSet[] = parsedSets.map((set: any) => ({
        ...set,
        createdAt: new Date(set.createdAt)
      }));
      setQuestionSets(setsWithDates);
    }
    
    if (savedResults) {
      const parsedResults = JSON.parse(savedResults);
      const resultsWithDates: QuizResult[] = parsedResults.map((result: any) => ({
        ...result,
        completedAt: new Date(result.completedAt)
      }));
      setQuizResults(resultsWithDates);
    }
  }, []);

  // Save questionSets to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('quizApp_questionSets', JSON.stringify(questionSets));
  }, [questionSets]);

  // Save results to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('quizApp_results', JSON.stringify(quizResults));
  }, [quizResults]);

  const handleQuestionSetAdded = (questionSet: QuestionSet) => {
    setQuestionSets(prev => [...prev, questionSet]);
    setCurrentView('home');
  };

  const handleStartQuiz = (questionSet: QuestionSet) => {
    setCurrentQuestionSet(questionSet);
    setCurrentView('quiz');
  };

  const handleQuizComplete = (quizState: QuizState) => {
    setCurrentQuizState(quizState);
    setCurrentView('results');
  };

  const handleRetakeQuiz = () => {
    if (currentQuestionSet) {
      setCurrentView('quiz');
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentQuestionSet(null);
    setCurrentQuizState(null);
  };

  const handleDeleteQuestionSet = (id: string) => {
    setQuestionSets(prev => prev.filter(set => set.id !== id));
  };

  const handleSaveResult = (result: QuizResult) => {
    setQuizResults(prev => [...prev, result]);
  };

  const handleClearResults = () => {
    setQuizResults([]);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'upload', label: 'Upload Quiz', icon: Upload },
    { id: 'history', label: 'Results', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">QuizMaster</h1>
            </div>
            
            {currentView !== 'quiz' && currentView !== 'results' && (
              <div className="flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id as AppView)}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        currentView === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to QuizMaster
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Create, take, and manage interactive quizzes with instant feedback and detailed results.
              </p>
            </div>
            
            <QuestionSetList
              questionSets={questionSets}
              onStartQuiz={handleStartQuiz}
              onDeleteQuestionSet={handleDeleteQuestionSet}
            />
          </div>
        )}

        {currentView === 'upload' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload New Quiz</h2>
              <p className="text-gray-600">Add questions in JSON format to create a new quiz</p>
            </div>
            <QuestionSetUpload onQuestionSetAdded={handleQuestionSetAdded} />
          </div>
        )}

        {currentView === 'quiz' && currentQuestionSet && (
          <QuizInterface
            questionSet={currentQuestionSet}
            onQuizComplete={handleQuizComplete}
            onBackToHome={handleBackToHome}
          />
        )}

        {currentView === 'results' && currentQuizState && currentQuestionSet && (
          <QuizResults
            quizState={currentQuizState}
            questionSet={currentQuestionSet}
            onRetakeQuiz={handleRetakeQuiz}
            onBackToHome={handleBackToHome}
            onSaveResult={handleSaveResult}
          />
        )}

        {currentView === 'history' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Results</h2>
              <p className="text-gray-600">Track your progress and review past performances</p>
            </div>
            <ResultsHistory
              results={quizResults}
              onClearResults={handleClearResults}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;