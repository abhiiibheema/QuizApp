import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronRight, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Question, QuizState, QuestionSet } from '../types';
import { shuffleArray, shuffleQuestionOptions, arraysEqual } from '../utils/quizUtils';

interface Props {
  questionSet: QuestionSet;
  onQuizComplete: (quizState: QuizState) => void;
  onBackToHome: () => void;
}

export default function QuizInterface({ questionSet, onQuizComplete, onBackToHome }: Props) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    userAnswers: [],
    isCompleted: false,
    score: 0,
    shuffledQuestions: []
  });
  
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]); // Changed from selectedAnswer
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const shuffledQuestions = shuffleArray(questionSet.questions).map(shuffleQuestionOptions);
    setQuizState(prev => ({
      ...prev,
      shuffledQuestions
    }));
  }, [questionSet]);

  const currentQuestion = quizState.shuffledQuestions[quizState.currentQuestionIndex];
  const progress = ((quizState.currentQuestionIndex + 1) / quizState.shuffledQuestions.length) * 100;
  const isMultipleAnswer = currentQuestion?.correctAnswers.length > 1; // Determine question type

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    if (isMultipleAnswer) {
      setSelectedAnswers(prev =>
        prev.includes(answer)
          ? prev.filter(a => a !== answer)
          : [...prev, answer]
      );
    } else {
      setSelectedAnswers([answer]);
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion) return;

    const correct = arraysEqual(selectedAnswers, currentQuestion.correctAnswers);
    setIsCorrect(correct);
    setShowFeedback(true);

    const newAnswer = {
      questionIndex: quizState.currentQuestionIndex,
      selectedAnswers,
      isCorrect: correct
    };

    setQuizState(prev => ({
      ...prev,
      userAnswers: [...prev.userAnswers, newAnswer],
      score: correct ? prev.score + 1 : prev.score
    }));
  };

  const handleNextQuestion = () => {
    const nextIndex = quizState.currentQuestionIndex + 1;
    
    if (nextIndex >= quizState.shuffledQuestions.length) {
      const finalState = {
        ...quizState,
        isCompleted: true
      };
      setQuizState(finalState);
      onQuizComplete(finalState);
    } else {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: nextIndex
      }));
      setSelectedAnswers([]);
      setShowFeedback(false);
      setIsCorrect(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBackToHome}
            className="flex items-center text-white/80 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <div className="text-right">
            <p className="text-white/80 text-sm">Question</p>
            <p className="text-xl font-bold">
              {quizState.currentQuestionIndex + 1} of {quizState.shuffledQuestions.length}
            </p>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="p-8">
        <div className="mb-8">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            className="prose prose-lg max-w-none text-gray-900 leading-relaxed
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-p:text-gray-900 prose-p:leading-relaxed
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
              prose-pre:bg-gray-800 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
              prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-4
              prose-ul:text-gray-900 prose-ol:text-gray-900 prose-li:text-gray-900
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
          >
            {currentQuestion.question}
          </ReactMarkdown>
          <p className="text-sm text-gray-600 mt-2">
            {isMultipleAnswer ? 'Select all that apply' : 'Choose one'}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {currentQuestion.options.map((option, index) => (
            <label
              key={index}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center ${
                selectedAnswers.includes(option) && showFeedback
                  ? isCorrect && currentQuestion.correctAnswers.includes(option)
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-red-500 bg-red-50 text-red-800'
                  : selectedAnswers.includes(option)
                  ? 'border-blue-500 bg-blue-50 text-blue-800'
                  : showFeedback && currentQuestion.correctAnswers.includes(option)
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 text-gray-800'
              }`}
            >
              <input
                type={isMultipleAnswer ? 'checkbox' : 'radio'}
                name={isMultipleAnswer ? undefined : `question-${quizState.currentQuestionIndex}`}
                checked={selectedAnswers.includes(option)}
                onChange={() => handleAnswerSelect(option)}
                disabled={showFeedback}
                className="mr-3"
              />
              <div className="flex-1">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  className="prose prose-sm max-w-none
                    prose-headings:text-current prose-headings:font-semibold prose-headings:mb-1
                    prose-p:text-current prose-p:mb-0 prose-p:leading-normal
                    prose-strong:text-current prose-strong:font-medium
                    prose-code:bg-black/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                    prose-ul:text-current prose-ol:text-current prose-li:text-current prose-li:mb-0
                    prose-a:text-current prose-a:underline"
                >
                  {option}
                </ReactMarkdown>
              </div>
              {showFeedback && (
                <>
                  {currentQuestion.correctAnswers.includes(option) && (
                    <CheckCircle className="w-5 h-5 text-green-600 ml-3 flex-shrink-0" />
                  )}
                  {selectedAnswers.includes(option) && !currentQuestion.correctAnswers.includes(option) && (
                    <XCircle className="w-5 h-5 text-red-600 ml-3 flex-shrink-0" />
                  )}
                </>
              )}
            </label>
          ))}
        </div>

        {showFeedback && (
          <div className={`rounded-xl p-6 mb-8 ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start">
              {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3 className={`font-semibold mb-3 ${
                  isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </h3>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  className={`prose prose-sm max-w-none ${
                    isCorrect ? 'prose-green' : 'prose-red'
                  }
                    prose-headings:${isCorrect ? 'text-green-800' : 'text-red-800'} prose-headings:font-semibold
                    prose-p:${isCorrect ? 'text-green-700' : 'text-red-700'} prose-p:leading-relaxed
                    prose-strong:${isCorrect ? 'text-green-800' : 'text-red-800'} prose-strong:font-medium
                    prose-code:${isCorrect ? 'bg-green-200' : 'bg-red-200'} prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                    prose-pre:bg-gray-800 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                    prose-blockquote:${isCorrect ? 'border-green-400 bg-green-100' : 'border-red-400 bg-red-100'} prose-blockquote:border-l-4 prose-blockquote:pl-4
                    prose-ul:${isCorrect ? 'text-green-700' : 'text-red-700'} prose-ol:${isCorrect ? 'text-green-700' : 'text-red-700'} prose-li:${isCorrect ? 'text-green-700' : 'text-red-700'}
                    prose-a:${isCorrect ? 'text-green-600' : 'text-red-600'} prose-a:underline`}
                >
                  {currentQuestion.explanation}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <div className="text-sm text-gray-600">
            Score: {quizState.score} / {quizState.userAnswers.length}
          </div>
          
          {!showFeedback ? (
            <button
              onClick={handleSubmitAnswer}
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Submit Answer
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              {quizState.currentQuestionIndex + 1 >= quizState.shuffledQuestions.length ? 'View Results' : 'Next Question'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}