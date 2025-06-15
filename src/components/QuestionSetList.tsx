import React from 'react';
import { Play, Trash2, Calendar, FileText } from 'lucide-react';
import { QuestionSet } from '../types';

interface Props {
  questionSets: QuestionSet[];
  onStartQuiz: (questionSet: QuestionSet) => void;
  onDeleteQuestionSet: (id: string) => void;
}

export default function QuestionSetList({ questionSets, onStartQuiz, onDeleteQuestionSet }: Props) {
  if (questionSets.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-white/20 text-center">
        <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quiz Sets Available</h3>
        <p className="text-gray-600">Upload your first JSON file to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Quiz Sets</h3>
      <div className="space-y-4">
        {questionSets.map((questionSet) => (
          <div
            key={questionSet.id}
            className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {questionSet.name}
                </h4>
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {questionSet.questions.length} questions
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {questionSet.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onStartQuiz(questionSet)}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Quiz
                </button>
                <button
                  onClick={() => onDeleteQuestionSet(questionSet.id)}
                  className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}