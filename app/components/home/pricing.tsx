"use client"

import { motion } from "framer-motion"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Check, Clock, Star } from "lucide-react"

export default function Pricing() {
  const currentMonth = "March 2025"

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Premium features FREE for life when you sign up in March 2025",
      features: [
        "Advanced AI note enhancement",
        "Unlimited notes",
        "10 custom folders",
        "YouTube notes extraction",
        "PDF & image notes",
        "Basic quiz generation",
        "Community support",
      ],
      buttonText: "Sign Up Now",
      buttonVariant: "default",
      specialOffer: true,
      expiryDate: "March 31, 2025",
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "per month",
      description: "For serious note-takers",
      features: [
        "Advanced AI enhancement",
        "Unlimited notes",
        "Unlimited folders",
        "PDF & image extraction",
        "Quiz generation",
        "Flash cards",
        "Priority support",
      ],
      buttonText: "Upgrade to Pro",
      buttonVariant: "outline",
      highlighted: true,
    },
    {
      name: "Team",
      price: "$19.99",
      period: "per user/month",
      description: "For collaborative teams",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Shared notes & folders",
        "Admin controls",
        "API access",
        "Dedicated support",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline",
    },
  ]

  return (
    <section id="pricing" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Special Launch Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Sign up in {currentMonth} and get premium features{" "}
            <span className="text-blue-400 font-bold">FREE FOR LIFE</span>. Limited time offer.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={plan.highlighted ? "md:-mt-4 md:mb-4" : ""}
            >
              <Card
                className={`h-full flex flex-col relative ${
                  plan.specialOffer
                    ? "border-blue-500 bg-gradient-to-b from-blue-500/10 to-blue-600/5"
                    : plan.highlighted
                      ? "border-blue-500 bg-blue-900/20"
                      : "bg-white/5 border-white/10"
                }`}
              >
                {plan.specialOffer && (
                  <div className="absolute -top-4 left-0 right-0 mx-auto w-max bg-blue-600 text-white px-4 py-1 rounded-full font-medium text-sm shadow-lg">
                    Limited Time Offer
                  </div>
                )}
                <CardHeader className={plan.specialOffer ? "bg-blue-900/20 rounded-t-lg" : ""}>
                  <CardTitle className={`${plan.specialOffer ? "text-blue-300" : "text-white"} flex items-center`}>
                    {plan.name}
                    {plan.specialOffer && <Star className="h-5 w-5 ml-2 text-yellow-400 fill-yellow-400" />}
                  </CardTitle>
                  <div className="flex items-baseline mt-2">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="ml-1 text-gray-300">{plan.period}</span>}
                  </div>
                  <CardDescription
                    className={`${plan.specialOffer ? "text-gray-200" : "text-gray-400"} mt-2 font-medium`}
                  >
                    {plan.description}
                  </CardDescription>
                  {plan.specialOffer && plan.expiryDate && (
                    <div className="mt-3 flex items-center text-yellow-300 text-sm font-medium bg-blue-950/50 py-1 px-2 rounded-md inline-block">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Offer expires on {plan.expiryDate}</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check
                          className={`h-5 w-5 flex-shrink-0 ${plan.specialOffer ? "text-blue-300" : "text-blue-500"} mr-2`}
                        />
                        <span className={`${plan.specialOffer ? "text-white" : "text-gray-300"}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className={plan.specialOffer ? "bg-blue-900/20 rounded-b-lg" : ""}>
                  <Button
                    variant={plan.buttonVariant as "outline" | "default"}
                    className={`w-full ${
                      plan.specialOffer
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/50 animate-pulse"
                        : plan.highlighted
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : ""
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
                {plan.specialOffer && (
                  <div className="absolute -bottom-3 left-0 right-0 mx-auto w-max bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                    Premium features locked in forever
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

