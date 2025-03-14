"use client"

import { motion } from "framer-motion"
import { Brain, FolderKanban, Youtube, FileImage, BrainCircuit, FlaskConical } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"

export default function Features() {
  const features = [
    {
      icon: <Brain className="h-10 w-10 text-blue-500" />,
      title: "AI-Powered Note Enhancement",
      description: "Automatically generate summaries, analyze context, and get intelligent organization suggestions.",
    },
    {
      icon: <Youtube className="h-10 w-10 text-blue-500" />,
      title: "YouTube Notes",
      description: "Add a YouTube link and get AI-generated notes from video content.",
    },
    {
      icon: <FileImage className="h-10 w-10 text-blue-500" />,
      title: "PDF & Image Notes",
      description: "Extract and organize information from PDFs and images with AI assistance.",
    },
    {
      icon: <FolderKanban className="h-10 w-10 text-blue-500" />,
      title: "Intuitive Organization",
      description: "Create custom folders and let AI help organize your notes efficiently.",
    },
    {
      icon: <FlaskConical className="h-10 w-10 text-blue-500" />,
      title: "Quiz Generation",
      description: "Generate quizzes based on your notes to test your knowledge and retention.",
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-blue-500" />,
      title: "Mind Maps & Flash Cards",
      description: "Create visual mind maps and quick flash cards from your notes with AI.",
    },
  ]

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Features That Set Us Apart
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            NoteWave AI adapts to your workflow with powerful features designed to enhance your note-taking experience.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

