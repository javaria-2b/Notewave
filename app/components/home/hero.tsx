"use client"

import type React from "react"

import { Button } from "@/app/components/ui/button"
import { motion } from "framer-motion"
import { FileText, Sparkles, Youtube, FileImage, BookOpen } from "lucide-react"
import { FloatingNotes } from "@/app/components/home/floating-notes"
import { WaveAnimation } from "@/app/components/home/wave-animation"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative min-h-[calc(100vh-76px)] flex items-center">
      {/* Floating notes background */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingNotes count={6} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Transform Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600"> Notes</span>
              <br />
              With AI Power
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto"
          >
            Capture, organize, and enhance your ideas with AI-powered note-taking that adapts to your workflow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/home">
            
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              <Sparkles className="mr-2 h-5 w-5" />
              Try For Free
            </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-blue-500 hover:bg-blue-500/20 hover:text-white"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              See How It Works
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12 flex flex-wrap justify-center gap-6"
          >
            <FeatureIcon icon={<FileText className="w-6 h-6 text-blue-400" />} text="AI Note Taking" />
            <FeatureIcon icon={<Youtube className="w-6 h-6 text-blue-400" />} text="YouTube Notes" />
            <FeatureIcon icon={<FileImage className="w-6 h-6 text-blue-400" />} text="PDF & Image Notes" />
            <FeatureIcon icon={<Sparkles className="w-6 h-6 text-blue-400" />} text="AI Enhancement" />
          </motion.div>
        </div>
      </div>

      {/* Animated wave */}
      <div className="absolute bottom-0 right-0 w-96 h-96">
        <WaveAnimation />
      </div>
    </div>
  )
}

function FeatureIcon({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full">
      {icon}
      <span className="text-white text-sm">{text}</span>
    </div>
  )
}

