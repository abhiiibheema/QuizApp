import { Question, QuestionSet, QuizResult } from '../types';

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const shuffleQuestionOptions = (question: Question): Question => {
  const correctAnswers = question.correctAnswers;
  const shuffledOptions = shuffleArray(question.options);
  
  return {
    ...question,
    options: shuffledOptions,
    correctAnswers: correctAnswers // Keep the correct answers array the same
  };
};

export function validateQuestionSet(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.questions || !Array.isArray(data.questions)) {
    errors.push('Missing or invalid "questions" array');
    return { isValid: false, errors };
  }
  
  data.questions.forEach((question: any, index: number) => {
    if (!question.question || typeof question.question !== 'string') {
      errors.push(`Question ${index + 1}: Missing or invalid "question"`);
    }
    if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
      errors.push(`Question ${index + 1}: Must have at least 2 options`);
    }
    if (!question.correctAnswers || !Array.isArray(question.correctAnswers) || question.correctAnswers.length === 0) {
      errors.push(`Question ${index + 1}: Must have at least one correct answer`);
    } else {
      question.correctAnswers.forEach((answer: string) => {
        if (!question.options.includes(answer)) {
          errors.push(`Question ${index + 1}: Correct answer "${answer}" is not in options`);
        }
      });
    }
    if (!question.explanation || typeof question.explanation !== 'string') {
      errors.push(`Question ${index + 1}: Missing or invalid "explanation"`);
    }
  });
  
  return { isValid: errors.length === 0, errors };
}

export function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, index) => val === sortedB[index]);
}

export const calculateScore = (userAnswers: Array<{ isCorrect: boolean }>, totalQuestions: number) => {
  const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
  return {
    correct: correctAnswers,
    total: totalQuestions,
    percentage: Math.round((correctAnswers / totalQuestions) * 100)
  };
};

export const exportResults = (results: QuizResult[]) => {
  const csvContent = [
    'Quiz Name,Score,Total Questions,Percentage,Completed At',
    ...results.map(result => 
      `"${result.questionSetName}",${result.score},${result.totalQuestions},${result.percentage}%,"${result.completedAt.toLocaleString()}"`
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quiz-results.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};