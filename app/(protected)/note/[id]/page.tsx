'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getNoteById, deleteNote, moveNoteToFolder } from '../../../lib/noteStorage';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { Button } from '../../../components/ui/button';
import { getFolders } from '../../../lib/folderStorage';
import MoveToFolderModal from '../../../components/MoveToFolderModal';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';
import { generateQuizQuestions, QuizQuestion, generateFlashcards, Flashcard } from '../../../lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showFolderModal, setShowFolderModal] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [folders, setFolders] = useState<any[]>([]);
  
  // Quiz state
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  
  // Flashcard state
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState<boolean>(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState<boolean>(false);
  const [flashcardError, setFlashcardError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const noteData = getNoteById(id);
      if (noteData) {
        setNote(noteData);
      } else {
        // Note not found, redirect to home
        router.push('/home');
      }
      setLoading(false);
      
      // Load folders
      setFolders(getFolders());
    }
  }, [id, router]);

  const handleAddToFolder = () => {
    setShowFolderModal(true);
  };

  const handleMoveToFolder = (folderId: string) => {
    if (id) {
      moveNoteToFolder(id, folderId);
      // Update the note in state
      setNote({ ...note, folderId });
    }
  };

  const handleCopyText = () => {
    const textToCopy = note.content || note.description;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        alert('Text copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text. Please try again.');
      });
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (id) {
      deleteNote(id);
      router.push('/home');
    }
  };

  const handleGenerateQuiz = async () => {
    const noteContent = note.content || note.description;
    if (!noteContent.trim()) {
      setQuizError("Note content is empty. Cannot generate quiz questions.");
      return;
    }

    setIsGeneratingQuiz(true);
    setQuizError(null);
    
    try {
      const questions = await generateQuizQuestions(noteContent);
      setQuizQuestions(questions);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setQuizScore(0);
      setQuizCompleted(false);
    } catch (err) {
      console.error("Error generating quiz questions:", err);
      setQuizError("Failed to generate quiz questions. Please try again.");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isAnswerSubmitted) return;
    
    setIsAnswerSubmitted(true);
    
    if (selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer) {
      setQuizScore(quizScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
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
    setQuizScore(0);
    setQuizCompleted(false);
  };

  const handleGenerateFlashcards = async () => {
    const noteContent = note.content || note.description;
    if (!noteContent.trim()) {
      setFlashcardError("Note content is empty. Cannot generate flashcards.");
      return;
    }

    setIsGeneratingFlashcards(true);
    setFlashcardError(null);
    
    try {
      const generatedFlashcards = await generateFlashcards(noteContent);
      setFlashcards(generatedFlashcards);
      setCurrentFlashcardIndex(0);
      setIsFlashcardFlipped(false);
    } catch (err) {
      console.error("Error generating flashcards:", err);
      setFlashcardError("Failed to generate flashcards. Please try again.");
    } finally {
      setIsGeneratingFlashcards(false);
    }
  };

  const handleFlipFlashcard = () => {
    setIsFlashcardFlipped(!isFlashcardFlipped);
  };

  const handleNextFlashcard = () => {
    if (currentFlashcardIndex < flashcards.length - 1) {
      setCurrentFlashcardIndex(currentFlashcardIndex + 1);
      setIsFlashcardFlipped(false);
    } else {
      // Loop back to the first flashcard
      setCurrentFlashcardIndex(0);
      setIsFlashcardFlipped(false);
    }
  };

  const handlePreviousFlashcard = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex(currentFlashcardIndex - 1);
      setIsFlashcardFlipped(false);
    } else {
      // Loop to the last flashcard
      setCurrentFlashcardIndex(flashcards.length - 1);
      setIsFlashcardFlipped(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading note...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Note not found</p>
          <Link href="/home" className="text-black hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-white w-full">
        {/* Header */}
        <header className="bg-white py-4 px-6 flex items-center justify-between">
          <Link href="/home" className="text-black hover:text-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Notes
          </Link>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="note" className="w-full">
          <TabsList className="flex h-12 bg-white">
            
            <TabsTrigger 
              value="note"
              className="h-full flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-black data-[state=inactive]:bg-gray-100"
            >
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                Note
              </div>
            </TabsTrigger>

            <TabsTrigger 
              value="quiz"
              className="h-full flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-black data-[state=inactive]:bg-gray-100"
            >
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
                Quiz
              </div>
            </TabsTrigger>

            <TabsTrigger 
              value="flashcards"
              className="h-full flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-black data-[state=inactive]:bg-gray-100"
            >
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                </svg>
                Flashcards
              </div>
            </TabsTrigger>

            <TabsTrigger 
              value="transcript"
              className="h-full flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-black data-[state=inactive]:bg-gray-100"
            >
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
                Transcript
              </div>
            </TabsTrigger>

          </TabsList>

          {/* Content Section */}
          <div className="flex-grow p-6">
            <TabsContent value="note" className="mx-auto max-w-3xl mt-0">
              <h1 className="text-3xl font-bold mb-4 text-center">{note.title}</h1>
              <p className="text-gray-600 mb-6 text-center">{note.date}</p>
              
              {/* Note Content */}
              <div className={`whitespace-pre-wrap ${note.isRtl ? 'font-arabic text-right' : ''}`}>
                {note.content || note.description}
              </div>
              
              {/* Note Actions */}
              <div className="mt-8 flex gap-3 justify-center">
                <Button 
                  className="flex items-center gap-1 text-black hover:text-gray-800 border border-gray-300 px-3 py-1.5 rounded-md"
                  onClick={handleAddToFolder}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>
                  Add folder
                </Button>
                <Button 
                  className="flex items-center gap-1 text-black hover:text-gray-800 border border-gray-300 px-3 py-1.5 rounded-md"
                  onClick={handleCopyText}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                  </svg>
                  Copy text
                </Button>
                <Button 
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 border border-red-200 px-3 py-1.5 rounded-md"
                  onClick={handleDeleteClick}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  Delete
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="quiz" className="mx-auto max-w-3xl text-center py-12 mt-0">
              {quizQuestions.length === 0 ? (
                <>
                  <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold mb-2">Generate Quiz</h2>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">Generate quiz questions based on your note content to test your knowledge.</p>
                  {quizError && <p className="text-red-500 mb-4">{quizError}</p>}
                  <Button 
                    onClick={handleGenerateQuiz} 
                    disabled={isGeneratingQuiz}
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    {isGeneratingQuiz ? (
                      <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
                        Generating Quiz...
                      </div>
                    ) : (
                      "Generate Quiz"
                    )}
                  </Button>
                </>
              ) : quizCompleted ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Quiz Completed!</CardTitle>
                    <CardDescription>
                      You scored {quizScore} out of {quizQuestions.length} questions correctly.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="text-6xl font-bold mb-4">
                      {Math.round((quizScore / quizQuestions.length) * 100)}%
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={handleRestartQuiz} className="bg-black hover:bg-gray-800">
                        Restart Quiz
                      </Button>
                      <Button onClick={() => setQuizQuestions([])} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                        Close
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Question {currentQuestionIndex + 1} of {quizQuestions.length}</CardTitle>
                    <CardDescription>
                      Select the correct answer
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-4">{quizQuestions[currentQuestionIndex].question}</h3>
                      <div className="space-y-2">
                        {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                          <div 
                            key={index}
                            onClick={() => handleAnswerSelect(option)}
                            className={`p-3 border rounded-md cursor-pointer transition-colors ${
                              selectedAnswer === option 
                                ? isAnswerSubmitted 
                                  ? option === quizQuestions[currentQuestionIndex].correctAnswer
                                    ? 'bg-green-100 border-green-500'
                                    : 'bg-red-100 border-red-500'
                                  : 'bg-blue-100 border-blue-500'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            {option}
                            {isAnswerSubmitted && option === quizQuestions[currentQuestionIndex].correctAnswer && (
                              <span className="ml-2 text-green-600">✓</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center">
                      {!isAnswerSubmitted ? (
                        <Button 
                          onClick={handleSubmitAnswer} 
                          disabled={!selectedAnswer}
                          className="bg-black hover:bg-gray-800"
                        >
                          Submit Answer
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleNextQuestion}
                          className="bg-black hover:bg-gray-800"
                        >
                          {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="flashcards" className="mx-auto max-w-3xl text-center py-12 mt-0">
              {flashcards.length === 0 ? (
                <>
                  <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold mb-2">Create Flashcards</h2>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">Generate flashcards to help you memorize key concepts from your notes.</p>
                  {flashcardError && <p className="text-red-500 mb-4">{flashcardError}</p>}
                  <Button 
                    onClick={handleGenerateFlashcards} 
                    disabled={isGeneratingFlashcards}
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    {isGeneratingFlashcards ? (
                      <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
                        Creating Flashcards...
                      </div>
                    ) : (
                      "Create Flashcards"
                    )}
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="mb-4 text-sm text-gray-500">
                    Flashcard {currentFlashcardIndex + 1} of {flashcards.length}
                  </div>
                  
                  {/* Flashcard */}
                  <div 
                    className="w-full max-w-md h-64 mb-6 perspective-1000 cursor-pointer"
                    onClick={handleFlipFlashcard}
                  >
                    <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlashcardFlipped ? 'rotate-y-180' : ''}`}>
                      {/* Front of card */}
                      <div className="absolute w-full h-full bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-center backface-hidden shadow-md">
                        <div className="text-xl font-medium">{flashcards[currentFlashcardIndex].front}</div>
                      </div>
                      
                      {/* Back of card */}
                      <div className="absolute w-full h-full bg-gray-50 border border-gray-200 rounded-lg p-6 flex items-center justify-center backface-hidden rotate-y-180 shadow-md">
                        <div className="text-lg">{flashcards[currentFlashcardIndex].back}</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-500 mb-6">Click the card to flip it</p>
                  
                  {/* Navigation buttons */}
                  <div className="flex gap-4">
                    <Button 
                      onClick={handlePreviousFlashcard}
                      className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                      Previous
                    </Button>
                    <Button 
                      onClick={handleNextFlashcard}
                      className="bg-black hover:bg-gray-800"
                    >
                      Next
                    </Button>
                    <Button 
                      onClick={() => setFlashcards([])}
                      className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="transcript" className="mx-auto max-w-3xl text-center py-12 mt-0">
              <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">No Transcript Available</h2>
              <p className="text-gray-600 mb-6">This note doesn't have a transcript.</p>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Move to Folder Modal */}
      {showFolderModal && (
        <MoveToFolderModal
          folders={folders}
          onClose={() => setShowFolderModal(false)}
          onSelect={handleMoveToFolder}
          currentFolderId={note.folderId}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmationModal
          title="Delete Note"
          message="Are you sure you want to delete this note? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
} 