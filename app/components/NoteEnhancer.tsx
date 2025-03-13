"use client"

import React, { useState } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { enhanceNote } from "../lib/actions"
import { saveNote } from "../lib/noteStorage"
import { Input } from "./ui/input"

type EnhancedNote = {
  explanation: string
  context: string
  summary: string
}

interface NoteEnhancerProps {
  onSave?: (note: {
    title: string;
    content: string;
    aiExplanation?: string;
    aiContext?: string;
    aiSummary?: string;
  }) => void;
}

export function NoteEnhancer({ onSave }: NoteEnhancerProps) {
  const [note, setNote] = useState("")
  const [noteTitle, setNoteTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [enhancedNote, setEnhancedNote] = useState<EnhancedNote | null>(null)
  const [activeTab, setActiveTab] = useState("write")
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!note.trim()) {
      setError("Please enter a note to enhance")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await enhanceNote(note)
      setEnhancedNote(result)
      // Set a default title based on the note content
      if (!noteTitle) {
        const defaultTitle = note.split('\n')[0].substring(0, 50) || "Enhanced Note"
        setNoteTitle(defaultTitle)
      }
    } catch (err) {
      setError("Failed to enhance note. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNote = () => {
    if (enhancedNote) {
      // If external onSave function is provided, use that
      if (onSave) {
        onSave({
          title: noteTitle,
          content: note,
          aiExplanation: enhancedNote.explanation,
          aiContext: enhancedNote.context,
          aiSummary: enhancedNote.summary,
        })
        return
      }
      
      // Otherwise, use the internal save function
      const newNote = {
        id: Date.now().toString(),
        title: noteTitle || "AI Enhanced Note",
        description: note.substring(0, 100) + (note.length > 100 ? "..." : ""),
        date: new Date().toLocaleString(),
        content: note,
        aiExplanation: enhancedNote.explanation,
        aiContext: enhancedNote.context,
        aiSummary: enhancedNote.summary,
      }
      
      saveNote(newNote)
      // Reset form
      setNote("")
      setNoteTitle("")
      setEnhancedNote(null)
      setActiveTab("write")
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Enter your notes here..."
          className="min-h-[200px] resize-none"
          value={note}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
          disabled={isLoading}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
              Enhancing...
            </>
          ) : (
            "Enhance Note"
          )}
        </Button>
      </form>

      {enhancedNote && (
        <Card>
          <CardHeader>
            <CardTitle>Enhanced Note</CardTitle>
            <CardDescription>AI-generated content based on your notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSaved && (
              <div className="p-2 bg-green-100 text-green-700 rounded-md mb-4">
                Note saved successfully! You can access it in your notes list.
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="noteTitle" className="block text-sm font-medium mb-1">
                Note Title
              </label>
              <Input
                id="noteTitle"
                value={noteTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNoteTitle(e.target.value)}
                placeholder="Enter a title for your note"
                className="w-full"
              />
            </div>
            
            <Tabs defaultValue="explanation" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="explanation">Explanation</TabsTrigger>
                <TabsTrigger value="context">Context</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              <TabsContent value="explanation" className="mt-4 space-y-4">
                <div className="rounded-md bg-gray-50 p-4">
                  <h3 className="mb-2 font-medium">Explanation</h3>
                  <p className="text-sm whitespace-pre-wrap">{enhancedNote.explanation}</p>
                </div>
              </TabsContent>
              <TabsContent value="context" className="mt-4 space-y-4">
                <div className="rounded-md bg-gray-50 p-4">
                  <h3 className="mb-2 font-medium">Context</h3>
                  <p className="text-sm whitespace-pre-wrap">{enhancedNote.context}</p>
                </div>
              </TabsContent>
              <TabsContent value="summary" className="mt-4 space-y-4">
                <div className="rounded-md bg-gray-50 p-4">
                  <h3 className="mb-2 font-medium">Summary</h3>
                  <p className="text-sm whitespace-pre-wrap">{enhancedNote.summary}</p>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end mt-4">
              <Button onClick={handleSaveNote} className="bg-blue-600 hover:bg-blue-700">
                Save Note
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 