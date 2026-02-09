import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock, Terminal } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [loadingText, setLoadingText] = useState('Initializing Systems...');
  const [progress, setProgress] = useState(0);

  const steps = [
    'Initializing Systems...',
    'Connecting to Neural Engine...',
    'Decrypting Policy Metadata...',
    'Security Protocols: ACTIVE',
    'Ready for Deployment'
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setLoadingText(steps[currentStep]);
        setProgress((currentStep / (steps.length - 1)) * 100);
      } else {
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #6366f1 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative flex flex-col items-center max-w-md w-full px-6">
        <div className="relative mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 rounded-full border border-dashed border-purple-500/30"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 rounded-full border border-dotted border-indigo-500/20"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-24 h-24 bg-gradient-to-tr from-purple-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.4)]"
          >
            <Shield className="text-white w-12 h-12" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2 uppercase">
            CLAIM<span className="text-purple-500">GUARD</span>
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Advanced Fraud Analytics</p>
        </motion.div>

        <div className="w-full space-y-4">
          <div className="flex items-center gap-3 text-xs font-mono text-purple-400 bg-purple-500/5 p-3 rounded-lg border border-purple-500/10">
            <Terminal size={14} className="animate-pulse" />
            <span>{loadingText}</span>
          </div>
          
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: progress === 100 ? 1 : 0 }}
          className="mt-12 w-full"
        >
          <button
            onClick={onComplete}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-purple-50 transition-colors shadow-2xl shadow-white/10 flex items-center justify-center gap-2 group"
          >
            INITIALIZE ACCESS
            <Zap size={18} className="group-hover:text-purple-600 transition-colors" />
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-10 flex gap-8 text-[10px] font-bold text-gray-700 uppercase tracking-widest">
        <div className="flex items-center gap-1.5"><Lock size={10} /> Secure Node</div>
        <div>v3.4.1-PRIME</div>
        <div>Region: Global-1</div>
      </div>
    </motion.div>
  );
};

export default WelcomeScreen;
