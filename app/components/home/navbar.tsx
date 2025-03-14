"use client"

import { Button } from "@/app/components/ui/button"
import { AudioWaveformIcon as WaveformIcon, Menu, Star } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10"
    >
      <Link href="/" className="flex items-center space-x-2">
        <WaveformIcon className="w-8 h-8 text-blue-500" />
        <span className="text-white font-medium text-xl">NoteWave AI</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="hidden md:flex items-center bg-gradient-to-r from-blue-600/80 to-blue-800/80 rounded-full px-4 py-1.5"
      >
        <Star className="w-4 h-4 text-yellow-300 fill-yellow-300 mr-2" />
        <span className="text-white text-sm font-medium">
          Special Launch Offer: Premium features FREE for life in March 2025!
        </span>
      </motion.div>

      <div className="hidden md:flex items-center space-x-4">
        <Button variant="ghost" className="text-white hover:text-blue-400">
          Sign In
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
      </div>

      <Button variant="ghost" size="icon" className="md:hidden text-white">
        <Menu className="w-6 h-6" />
      </Button>
    </motion.nav>
  )
}

