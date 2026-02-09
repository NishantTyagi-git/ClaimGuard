import React from 'react'
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  onReturn: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onReturn }) => {
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
              TERMS OF SERVICE
            </span>
          </h1>

          <div className="glass-card rounded-[2.5rem] p-8 md:p-12 backdrop-blur-md mb-12">
            <h2 className="text-3xl font-bold mb-2 text-white">Terms of Service</h2>
            <p className="text-purple-400 mb-8 font-mono text-sm">Last Updated: July 22, 2025</p>

            <div className="space-y-8 text-gray-400 leading-relaxed">
                <p>By accessing or using the ClaimGuard platform and related services, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.</p>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">1. Introduction</h3>
                  <p>ClaimGuard (“we”) operates an advanced fraud analytics platform, connecting insurance providers with cutting-edge digital solutions, AI risk assessments, and tech integration. By accessing our platform or engaging with our services, you agree to these Terms of Service.</p>
                </div>

                <div className="border-b border-white/10"></div>

                <div>
                    <h3 className="text-xl font-bold text-white mb-3">2. Services Offered</h3>
                    <ul className="list-disc pl-6 space-y-3">
                        <li><strong>Fraud Prediction Models:</strong> AI-driven risk scoring for claims.</li>
                        <li><strong>Admin Dashboards:</strong> Centralized claim management interfaces.</li>
                        <li><strong>Analytics Reports:</strong> Real-time data visualization and deep insights.</li>
                        <li><strong>Tech Integration:</strong> Cloud setup, API bridges, and secure databases.</li>
                        <li><strong>Maintenance & Support:</strong> 24/7 technical assistance and system updates.</li>
                    </ul>
                </div>

                <div className="border-b border-white/10"></div>

                <div>
                    <h3 className="text-xl font-bold text-white mb-3">3. User Responsibilities</h3>
                    <p className="mb-4">By using ClaimGuard’s platform, you agree to:</p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="text-emerald-500 font-bold">✔</span>
                          <span>Provide accurate and updated claim metadata for valid assessments.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-emerald-500 font-bold">✔</span>
                          <span>Use our tools ethically within the bounds of insurance industry regulations.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-rose-500 font-bold">❌</span>
                          <span>Not attempt to reverse-engineer AI models or bypass security protocols.</span>
                        </li>
                    </ul>
                </div>

                <div className="border-b border-white/10"></div>

                <div>
                    <h3 className="text-xl font-bold text-white mb-3">4. Intellectual Property Rights</h3>
                    <p>All proprietary algorithms, AI weights, codebases, and UI designs on ClaimGuard are owned by our parent entity. Unauthorized duplication or utilization of these assets is strictly prohibited.</p>
                </div>

                <div className="border-b border-white/10"></div>

                <div>
                    <h3 className="text-xl font-bold text-white mb-3">5. Payment & Refund Policy</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Service fees are defined per-policy or per-tier as defined in your SLA.</li>
                      <li>Due to the real-time nature of AI compute, refunds for processed analyses are not applicable.</li>
                      <li>Billing disputes must be raised within 7 days of the invoice date.</li>
                    </ul>
                </div>

                <div className="border-b border-white/10"></div>

                <div>
                    <h3 className="text-xl font-bold text-white mb-3">6. Limitation of Liability</h3>
                    <p>ClaimGuard is a decision-support tool. We are not responsible for final insurance payout decisions or losses arising from reliance on risk scores alone. All AI predictions should be validated by a human adjuster.</p>
                </div>

                <div className="border-b border-white/10 text-center py-6">
                    <p className='text-xs font-bold tracking-widest text-gray-600'>© 2025 CLAIMGUARD ANALYTICS. ALL RIGHTS RESERVED.</p>
                </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TermsOfService
