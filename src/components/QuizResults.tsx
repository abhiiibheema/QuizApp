import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Trophy, RotateCcw, Home, Download, BookOpen } from 'lucide-react';
import { QuizState, QuestionSet, QuizResult } from '../types';

interface Props {
  quizState: QuizState;
  questionSet: QuestionSet;
  onRetakeQuiz: () => void;
  onBackToHome: () => void;
  onSaveResult: (result: QuizResult) => void;
}

export default function QuizResults({ 
  quizState, 
  questionSet, 
  onRetakeQuiz, 
  onBackToHome,
  onSaveResult 
}: Props) {
  const percentage = Math.round((quizState.score / quizState.shuffledQuestions.length) * 100);
  const incorrectAnswers = quizState.userAnswers
    .map((answer, index) => ({
      ...answer,
      question: quizState.shuffledQuestions[answer.questionIndex]
    }))
    .filter(answer => !answer.isCorrect);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage === 100) return 'Perfect Score! 🎉';
    if (percentage >= 80) return 'Excellent Work! 🌟';
    if (percentage >= 60) return 'Good Job! 👍';
    return 'Keep Practicing! 💪';
  };

  React.useEffect(() => {
    const result: QuizResult = {
      id: Date.now().toString(),
      questionSetId: questionSet.id,
      questionSetName: questionSet.name,
      score: quizState.score,
      totalQuestions: quizState.shuffledQuestions.length,
      percentage,
      completedAt: new Date(),
      incorrectAnswers: incorrectAnswers.map(answer => ({
        question: answer.question.question,
        selectedAnswers: answer.selectedAnswers,
        correctAnswers: answer.question.correctAnswers,
        explanation: answer.question.explanation
      }))
    };
    onSaveResult(result);
  }, []);

  const exportResult = () => {
    const resultData = {
      quizName: questionSet.name,
      score: quizState.score,
      totalQuestions: quizState.shuffledQuestions.length,
      percentage,
      completedAt: new Date().toISOString(),
      incorrectAnswers: incorrectAnswers.map(answer => ({
        question: answer.question.question,
        selectedAnswers: answer.selectedAnswers,
        correctAnswers: answer.question.correctAnswers,
        explanation: answer.question.explanation
      }))
    };

    const blob = new Blob([JSON.stringify(resultData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-result-${questionSet.name}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white text-center">
          <Trophy className="mx-auto h-16 w-16 mb-4" />
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-purple-100 text-lg">{questionSet.name}</p>
        </div>
        
        <div className="p-8 text-center">
          <div className="mb-8">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(percentage)}`}>
              {percentage}%
            </div>
            <div className="text-2xl font-semibold text-gray-700 mb-2">
              {quizState.score} out of {quizState.shuffledQuestions.length}
            </div>
            <div className="text-lg text-gray-600">
              {getScoreMessage(percentage)}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onRetakeQuiz}
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake Quiz
            </button>
            
            <button
              onClick={exportResult}
              className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Download className="w-5 h-5 mr-2" />
              Export Result
            </button>
            
            <button
              onClick={onBackToHome}
              className="flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {incorrectAnswers.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center mb-6">
            <BookOpen className="w-6 h-6 text-red-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">Review Incorrect Answers</h3>
          </div>
          
          <div className="space-y-6">
            {incorrectAnswers.map((answer, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Question {answer.questionIndex + 1}:
                  </h4>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    className="prose prose-sm max-w-none text-gray-900
                      prose-headings:text-gray-900 prose-headings:font-semibold
                      prose-p:text-gray-900 prose-p:leading-relaxed
                      prose-strong:text-gray-900 prose-strong:font-medium
                      prose-code:bg-gray-200 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                      prose-pre:bg-gray-800 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                      prose-blockquote:border-l-4 prose-blockquote:border-gray-400 prose-blockquote:bg-gray-100 prose-blockquote:pl-4
                      prose-ul:text-gray-900 prose-ol:text-gray-900 prose-li:text-gray-900
                      prose-a:text-blue-600 prose-a:underline"
                  >
                    {answer.question.question}
                  </ReactMarkdown>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-red-700 mb-2">Your Answers:</p>
                    <div className="text-red-800 bg-red-100 px-3 py-2 rounded-lg">
                      {answer.selectedAnswers.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {answer.selectedAnswers.map((ans, idx) => (
                            <li key={idx}>
                              <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                className="prose prose-sm max-w-none prose-red
                                  prose-headings:text-red-800 prose-headings:font-medium prose-headings:mb-1
                                  prose-p:text-red-800 prose-p:mb-0 prose-p:leading-normal
                                  prose-strong:text-red-800 prose-strong:font-medium
                                  prose-code:bg-red-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                                  prose-ul:text-red-800 prose-ol:text-red-800 prose-li:text-red-800 prose-li:mb-0
                                  prose-a:text-red-700 prose-a:underline"
                              >
                                {ans}
                              </ReactMarkdown>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No answer selected</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-green-700 mb-2">Correct Answers:</p>
                    <div className="text-green-800 bg-green-100 px-3 py-2 rounded-lg">
                      <ul className="list-disc list-inside">
                        {answer.question.correctAnswers.map((ans, idx) => (
                          <li key={idx}>
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              className="prose prose-sm max-w-none prose-green
                                prose-headings:text-green-800 prose-headings:font-medium prose-headings:mb-1
                                prose-p:text-green-800 prose-p:mb-0 prose-p:leading-normal
                                prose-strong:text-green-800 prose-strong:font-medium
                                prose-code:bg-green-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                                prose-ul:text-green-800 prose-ol:text-green-800 prose-li:text-green-800 prose-li:mb-0
                                prose-a:text-green-700 prose-a:underline"
                            >
                              {ans}
                            </ReactMarkdown>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Explanation:</p>
                  <div className="text-gray-800 bg-gray-100 px-3 py-2 rounded-lg">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      className="prose prose-sm max-w-none text-gray-800
                        prose-headings:text-gray-900 prose-headings:font-semibold
                        prose-p:text-gray-800 prose-p:leading-relaxed
                        prose-strong:text-gray-900 prose-strong:font-medium
                        prose-code:bg-gray-200 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                        prose-pre:bg-gray-800 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                        prose-blockquote:border-l-4 prose-blockquote:border-gray-400 prose-blockquote:bg-white prose-blockquote:pl-4
                        prose-ul:text-gray-800 prose-ol:text-gray-800 prose-li:text-gray-800
                        prose-a:text-blue-600 prose-a:underline"
                    >
                      {answer.question.explanation}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}