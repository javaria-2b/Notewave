import Hero from "@/app/components/home/hero"
import Navbar from "@/app/components/home/navbar"
import { SparklesCore } from "@/app/components/home/sparkles"
import Features from "@/app/components/home/features"
import Testimonials from "@/app/components/home/testimonials"
import Pricing from "@/app/components/home/pricing"
import Footer from "@/app/components/home/footer"
import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation"

export default async function Home() {
  const user = await stackServerApp.getUser();  // or: stackServerApp.getUser({ or: "redirect" })
  if (user) {
    redirect("/home");
  }
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Ambient background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#3B82F6"
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <Footer />
      </div>
    </main>
  )
}

