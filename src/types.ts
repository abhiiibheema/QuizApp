export interface Question {
  question: string;
  options: string[];
  correctAnswers: string[];  // Changed from correctAnswer
  explanation: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  userAnswers: {
    questionIndex: number;
    selectedAnswers: string[];  // Changed from selectedAnswer
    isCorrect: boolean;
  }[];
  isCompleted: boolean;
  score: number;
  shuffledQuestions: Question[];
}

export interface QuizResult {
  id: string;
  questionSetId: string;
  questionSetName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: Date;
  incorrectAnswers: {
    question: string;
    selectedAnswers: string[];  // Changed from selectedAnswer
    correctAnswers: string[];   // Changed from correctAnswer
    explanation: string;
  }[];
}