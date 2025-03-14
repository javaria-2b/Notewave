"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FileText, FileImage, Youtube, BookOpen } from "lucide-react"

export function FloatingNotes({ count = 5 }) {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })

  useEffect(() => {
    // Update dimensions only on client side
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const icons = [
    <FileText key="filetext" className="w-8 h-8 text-blue-400/50" />,
    <FileImage key="fileimage" className="w-8 h-8 text-blue-400/50" />,
    <Youtube key="youtube" className="w-8 h-8 text-blue-400/50" />,
    <BookOpen key="bookopen" className="w-8 h-8 text-blue-400/50" />,
  ]

  return (
    <div className="relative w-full h-full">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
          }}
          animate={{
            x: [Math.random() * dimensions.width, Math.random() * dimensions.width, Math.random() * dimensions.width],
            y: [
              Math.random() * dimensions.height,
              Math.random() * dimensions.height,
              Math.random() * dimensions.height,
            ],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <div className="relative w-16 h-20 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center transform hover:scale-110 transition-transform">
            {icons[i % icons.length]}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

