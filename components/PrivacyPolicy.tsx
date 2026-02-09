import React from 'react'
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

interface PrivacyPolicyProps {
  onReturn: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onReturn }) => {
  return (
    <section className="py-12 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <button
            onClick={onReturn}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <h1 className="text-4xl font-bold mb-8 text-center uppercase tracking-widest">
            <span className="text-gradient">
              PRIVACY POLICY
            </span>
          </h1>

          <div className="glass-card rounded-[2.5rem] p-8 md:p-12 backdrop-blur-sm mb-12 relative">
            <div className="absolute top-8 right-8 text-purple-500 opacity-10">
              <ShieldCheck size={80} />
            </div>

            <h2 className="text-3xl font-bold mb-2 text-white">Privacy Policy</h2>
            <p className="text-purple-400 mb-8 font-mono text-sm">Last Updated: July 22, 2025</p>

            <div className="space-y-8 text-gray-400 leading-relaxed">
                <p>ClaimGuard (“we”) operates the platform at claimguard.ai, a system dedicated to high-security fraud detection. This policy explains how we handle policyholder and corporate data in compliance with GDPR and Indian data protection standards.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">1. Data We Collect</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Claim Metadata:</strong> Amounts, dates, and severity.</li>
                      <li><strong>Policy Info:</strong> Customer duration and premium details.</li>
                      <li><strong>Technical Data:</strong> IP logs and session metrics.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">2. Processing Basis</h3>
                    <p>We process data under the legal basis of <strong>Legitimate Interest</strong> to prevent financial fraud and <strong>Legal Obligation</strong> to comply with anti-money laundering laws.</p>
                  </div>
                </div>

                <div className="border-b border-white/10"></div>

                <div>
                    <h3 className="text-xl font-bold text-white mb-3">3. Data Security & Storage</h3>
                    <p className="mb-4">All data is stored using AES-256 encryption. We utilize localized cloud instances within the Indian Economic Area (IEA).</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Data is kept for the duration of the policy + 3 years.</li>
                      <li>Access is strictly restricted to authorized neural network administrators.</li>
                    </ul>
                </div>

                <div className="border-b border-white/10"></div>

                <div>
                    <h3 className="text-xl font-bold text-white mb-3">4. Cookies & Tracking</h3>
                    <p>We use essential functional cookies to maintain session state in the dashboard. No third-party advertising tracking is utilized within the core analysis engine.</p>
                </div>

                <div className="border-b border-white/10"></div>

                <div>
                    <h3 className="text-xl font-bold text-white mb-3">5. Your Rights</h3>
                    <p className="mb-4">Under GDPR, you have the right to:</p>
                    <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                      <div className="bg-white/5 p-3 rounded-lg border border-white/10">Request Access</div>
                      <div className="bg-white/5 p-3 rounded-lg border border-white/10">Correct Errors</div>
                      <div className="bg-white/5 p-3 rounded-lg border border-white/10">Right to Erasure</div>
                      <div className="bg-white/5 p-3 rounded-lg border border-white/10">Withdraw Consent</div>
                    </div>
                </div>

                <div className="border-b border-white/10 py-6">
                    <p className="text-sm">For questions regarding your data privacy, please contact:</p>
                    <p className="text-white font-mono mt-2">privacy@claimguard.ai</p>
                </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PrivacyPolicy
