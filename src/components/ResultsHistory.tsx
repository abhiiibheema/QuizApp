import React from 'react';
import { Calendar, Trophy, Download, Trash2, TrendingUp } from 'lucide-react';
import { QuizResult } from '../types';
import { exportResults } from '../utils/quizUtils';

interface Props {
  results: QuizResult[];
  onClearResults: () => void;
}

export default function ResultsHistory({ results, onClearResults }: Props) {
  if (results.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-white/20 text-center">
        <Trophy className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Yet</h3>
        <p className="text-gray-600">Complete some quizzes to see your results here!</p>
      </div>
    );
  }

  const averageScore = Math.round(
    results.reduce((sum, result) => sum + result.percentage, 0) / results.length
  );

  const bestScore = Math.max(...results.map(result => result.percentage));

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 text-center">
          <TrendingUp className="mx-auto h-8 w-8 text-blue-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{averageScore}%</div>
          <div className="text-gray-600">Average Score</div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 text-center">
          <Trophy className="mx-auto h-8 w-8 text-yellow-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{bestScore}%</div>
          <div className="text-gray-600">Best Score</div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 text-center">
          <Calendar className="mx-auto h-8 w-8 text-green-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{results.length}</div>
          <div className="text-gray-600">Quizzes Taken</div>
        </div>
      </div>

      {/* Results List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Quiz History</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportResults(results)}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Export All
            </button>
            <button
              onClick={onClearResults}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear History
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {results.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime()).map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {result.questionSetName}
                  </h4>
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {result.completedAt.toLocaleDateString()} at {result.completedAt.toLocaleTimeString()}
                    </span>
                    <span>
                      {result.score} / {result.totalQuestions} questions
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${
                    result.percentage >= 80 ? 'text-green-600' :
                    result.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {result.percentage}%
                  </div>
                  {result.incorrectAnswers.length > 0 && (
                    <div className="text-sm text-gray-500 mt-1">
                      {result.incorrectAnswers.length} incorrect
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}