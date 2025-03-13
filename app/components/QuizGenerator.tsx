'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { generateQuizQuestions, QuizQuestion } from '../lib/actions';

interface QuizGeneratorProps {
  noteContent: string;
  noteTitle: string;
  onClose: () => void;
}

export default function QuizGenerator({ noteContent, noteTitle, onClose }: QuizGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate quiz questions based on note content
  const handleGenerateQuestions = async () => {
    if (!noteContent.trim()) {
      setError("Note content is empty. Cannot generate quiz questions.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const generatedQuestions = await generateQuizQuestions(noteContent);
      setQuestions(generatedQuestions);
    } catch (err) {
      console.error("Error generating quiz questions:", err);
      setError("Failed to generate quiz questions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isAnswerSubmitted) return;
    
    setIsAnswerSubmitted(true);
    
    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Quiz: {noteTitle}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-8">
            <p className="mb-4">Generate quiz questions based on your note content to test your knowledge.</p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Button 
              onClick={handleGenerateQuestions} 
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
                  Generating Quiz...
                </>
              ) : (
                "Generate Quiz"
              )}
            </Button>
          </div>
        ) : quizCompleted ? (
          <Card>
            <CardHeader>
              <CardTitle>Quiz Completed!</CardTitle>
              <CardDescription>
                You scored {score} out of {questions.length} questions correctly.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="text-6xl font-bold mb-4">
                {Math.round((score / questions.length) * 100)}%
              </div>
              <div className="flex gap-4">
                <Button onClick={handleRestartQuiz} className="bg-blue-600 hover:bg-blue-700">
                  Restart Quiz
                </Button>
                <Button onClick={onClose} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
              <CardDescription>
                Select the correct answer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">{questions[currentQuestionIndex].question}</h3>
                <div className="space-y-2">
                  {questions[currentQuestionIndex].options.map((option, index) => (
                    <div 
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedAnswer === option 
                          ? isAnswerSubmitted 
                            ? option === questions[currentQuestionIndex].correctAnswer
                              ? 'bg-green-100 border-green-500'
                              : 'bg-red-100 border-red-500'
                            : 'bg-blue-100 border-blue-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {option}
                      {isAnswerSubmitted && option === questions[currentQuestionIndex].correctAnswer && (
                        <span className="ml-2 text-green-600">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                {!isAnswerSubmitted ? (
                  <Button 
                    onClick={handleSubmitAnswer} 
                    disabled={!selectedAnswer}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNextQuestion}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 