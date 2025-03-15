import React from 'react';
import Link from 'next/link';
import { SparklesCore } from "@/app/components/home/sparkles";
import Navbar from "@/app/components/home/navbar";
import Footer from "@/app/components/home/footer";

export default function TermsAndConditions() {
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
              Terms and Conditions
            </span>
          </h1>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-300 mb-4">
              Welcome to Note0 ("we," "our," or "us"). These Terms and Conditions govern your use of our website, web application, and services (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the Service.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Use of Service</h2>
            <p className="text-gray-300 mb-4">
              Our Service allows you to create, store, organize, and enhance notes using AI technology. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. User Content</h2>
            <p className="text-gray-300 mb-4">
              Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material ("Content"). You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights.
            </p>
            <p className="text-gray-300 mb-4">
              You represent and warrant that: (i) the Content is yours or you have the right to use it and grant us the rights and license as provided in these Terms, and (ii) the posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. AI-Generated Content</h2>
            <p className="text-gray-300 mb-4">
              Our Service uses artificial intelligence to enhance, summarize, and generate content based on your inputs. You acknowledge that AI-generated content may not always be accurate, complete, or appropriate. We do not guarantee the quality, accuracy, or appropriateness of AI-generated content, and you use such content at your own risk.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-300 mb-4">
              The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of Note0 and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Note0.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Termination</h2>
            <p className="text-gray-300 mb-4">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              In no event shall Note0, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Changes to Terms</h2>
            <p className="text-gray-300 mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">9. Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about these Terms, please contact us at support@note0.com.
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