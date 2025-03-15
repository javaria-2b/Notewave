import React from 'react';
import Link from 'next/link';
import { SparklesCore } from "@/app/components/home/sparkles";
import Navbar from "@/app/components/home/navbar";
import Footer from "@/app/components/home/footer";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Ambient background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={70}
          className="w-full h-full"
          particleColor="#3B82F6"
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600">
              Privacy Policy
            </span>
          </h1>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-300 mb-4">
              At Note0 ("we," "our," or "us"), we respect your privacy and are committed to protecting it through our compliance with this policy. This Privacy Policy describes the types of information we may collect from you or that you may provide when you use our website, web application, and services (collectively, the "Service") and our practices for collecting, using, maintaining, protecting, and disclosing that information.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Information We Collect</h2>
            <p className="text-gray-300 mb-4">
              We collect several types of information from and about users of our Service, including:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
              <li>Personal information such as name, email address, and other identifiers by which you may be contacted online or offline when you register for an account.</li>
              <li>Information about your internet connection, the equipment you use to access our Service, and usage details.</li>
              <li>Content you create, upload, or store using our Service, including notes, documents, and other materials.</li>
              <li>Information you provide when you contact our customer support.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">
              We use information that we collect about you or that you provide to us, including any personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
              <li>To provide, maintain, and improve our Service.</li>
              <li>To process and complete transactions, and send you related information, including confirmations and receipts.</li>
              <li>To send you technical notices, updates, security alerts, and support and administrative messages.</li>
              <li>To respond to your comments, questions, and requests, and provide customer service.</li>
              <li>To communicate with you about products, services, offers, promotions, and events, and provide other news or information about us and our partners.</li>
              <li>To monitor and analyze trends, usage, and activities in connection with our Service.</li>
              <li>To personalize and improve the Service and provide content or features that match user profiles or interests.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. AI Processing and Data Usage</h2>
            <p className="text-gray-300 mb-4">
              Our Service uses artificial intelligence to process and enhance your content. When you use our AI features:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
              <li>Your content is processed by our AI systems to generate summaries, explanations, and other enhancements.</li>
              <li>We may use anonymized and aggregated data to improve our AI models and Service.</li>
              <li>We do not use your personal content to train AI models without your explicit consent.</li>
              <li>You maintain ownership of your original content and any AI-generated content based on your inputs.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Disclosure of Your Information</h2>
            <p className="text-gray-300 mb-4">
              We may disclose personal information that we collect or you provide as described in this privacy policy:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-2">
              <li>To our subsidiaries and affiliates.</li>
              <li>To contractors, service providers, and other third parties we use to support our business.</li>
              <li>To comply with any court order, law, or legal process, including to respond to any government or regulatory request.</li>
              <li>To enforce or apply our terms of use and other agreements.</li>
              <li>If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of Note0, our customers, or others.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Data Security</h2>
            <p className="text-gray-300 mb-4">
              We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on secure servers behind firewalls. Any payment transactions will be encrypted using SSL technology.
            </p>
            <p className="text-gray-300 mb-4">
              The safety and security of your information also depends on you. Where we have given you (or where you have chosen) a password for access to certain parts of our Service, you are responsible for keeping this password confidential. We ask you not to share your password with anyone.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Your Rights and Choices</h2>
            <p className="text-gray-300 mb-4">
              You can review and change your personal information by logging into the Service and visiting your account profile page. You may also send us an email to request access to, correct, or delete any personal information that you have provided to us. We may not accommodate a request to change information if we believe the change would violate any law or legal requirement or cause the information to be incorrect.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-300 mb-4">
              Our Service is not intended for children under 13 years of age. No one under age 13 may provide any information to or on the Service. We do not knowingly collect personal information from children under 13. If you are under 13, do not use or provide any information on this Service or on or through any of its features.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">9. Changes to Our Privacy Policy</h2>
            <p className="text-gray-300 mb-4">
              It is our policy to post any changes we make to our privacy policy on this page. If we make material changes to how we treat our users' personal information, we will notify you through a notice on the Service home page. The date the privacy policy was last revised is identified at the top of the page.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">10. Contact Information</h2>
            <p className="text-gray-300 mb-4">
              To ask questions or comment about this privacy policy and our privacy practices, contact us at: privacy@note0.com
            </p>
            
            <div className="mt-12 flex justify-center">
              <Link href="/" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </main>
  );
} 