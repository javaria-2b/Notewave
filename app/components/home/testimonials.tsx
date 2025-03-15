"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/app/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "Note0 AI has completely transformed how I take notes in my medical studies. The AI summaries and organization features save me hours every week.",
      name: "Dr. Sarah Johnson",
      role: "Medical Student",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      quote:
        "As a researcher, I need to organize complex information. Note0's AI helps me connect ideas across different papers and generate insights I might have missed.",
      name: "Prof. Michael Chen",
      role: "Research Scientist",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      quote:
        "The YouTube note feature is a game-changer for my online courses. I can extract key points from lectures without manually transcribing everything.",
      name: "Alex Rivera",
      role: "Online Educator",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-transparent to-black/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            What Our Users Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Join thousands of students, professionals, and creative thinkers who've elevated their note-taking
            experience.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full flex flex-col">
                <CardContent className="pt-6 flex-grow">
                  <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                </CardContent>
                <CardFooter className="border-t border-white/10 pt-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-medium">{testimonial.name}</p>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

