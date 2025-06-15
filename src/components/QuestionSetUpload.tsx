import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Question, QuestionSet } from '../types';
import { validateQuestionSet } from '../utils/quizUtils';

interface Props {
  onQuestionSetAdded: (questionSet: QuestionSet) => void;
}

export default function QuestionSetUpload({ onQuestionSetAdded }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>('');

  const handleFile = async (file: File) => {
    setUploading(true);
    setErrors([]);
    setSuccess('');

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      const validation = validateQuestionSet(data);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      const questionSet: QuestionSet = {
        id: Date.now().toString(),
        name: file.name.replace('.json', '') || 'Untitled Quiz',
        questions: data.questions,
        createdAt: new Date()
      };

      onQuestionSetAdded(questionSet);
      setSuccess(`Successfully uploaded "${questionSet.name}" with ${questionSet.questions.length} questions`);
    } catch (error) {
      setErrors(['Invalid JSON file. Please check the format.']);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      handleFile(file);
    } else {
      setErrors(['Please upload a valid JSON file']);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
      <div className="text-center mb-6">
        <FileText className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Quiz Questions</h3>
        <p className="text-gray-600">Upload a JSON file with your quiz questions</p>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drag and drop your JSON file here
        </p>
        <p className="text-gray-500 mb-4">or</p>
        <label className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer transition-colors duration-200">
          <Upload className="w-5 h-5 mr-2" />
          Choose File
          <input
            type="file"
            accept=".json"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>

      {uploading && (
        <div className="mt-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Processing file...</p>
        </div>
      )}

      {errors.length > 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-red-800 font-medium mb-2">Upload Errors:</h4>
              <ul className="text-red-700 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-3">Expected JSON Format:</h4>
        <pre className="text-sm text-gray-700 bg-white rounded p-4 overflow-x-auto">
{`{
  "questions": [
    {
      "question": "What is **React**?",
      "options": [
        "A JavaScript library for building user interfaces",
        "A database management system", 
        "A CSS framework",
        "A server-side language"
      ],
      "correctAnswers": ["A JavaScript library for building user interfaces"],
      "explanation": "React is a popular JavaScript library developed by Facebook for building user interfaces, particularly for web applications. It allows developers to create reusable UI components and manage application state efficiently."
    },
    {
      "question": "Which are programming languages?",
      "options": ["Java", "HTML", "Python", "CSS"],
      "correctAnswers": ["Java", "Python"],
      "explanation": "Java and Python are programming languages, while HTML and CSS are not."
    }
  ]
}`}
        </pre>
        <div className="mt-4 text-sm text-gray-600">
          <p className="font-medium mb-2">Markdown Support:</p>
          <ul className="space-y-1 text-xs">
            <li>• Use **bold text** for emphasis</li>
            <li>• Use `code snippets` for technical terms</li>
            <li>• Use {'>'} blockquotes for important notes</li>
            <li>• Use - or * for bullet lists</li>
            <li>• Use [links](url) for references</li>
            <li>• Use ```code blocks``` for longer code examples</li>
          </ul>
        </div>
      </div>
    </div>
  );
}