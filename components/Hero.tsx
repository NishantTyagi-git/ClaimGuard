import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldAlert, Cpu, BarChart3, Hammer } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-between gap-12">
      <div className="lg:w-1/2 text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6">
            Next-Gen Fraud Detection
          </span>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-8">
            Stop Claims Fraud <br />
            <span className="text-gradient">Before It Happens.</span>
          </h1>
          <p className="text-gray-400 text-lg lg:text-xl max-w-2xl mb-10 leading-relaxed">
            ClaimGuard leverages advanced Decision Tree models and Gemini AI to provide real-time risk scoring, saving millions in fraudulent payouts with sub-second analysis.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button
              onClick={onStart}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-purple-600/20"
            >
              Launch Dashboard
              <ChevronRight size={20} />
            </button>
            <div className="relative group">
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold transition-all flex items-center gap-2">
                Watch Demo
                <Hammer size={16} className="text-yellow-500" />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-yellow-600 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                CONSTRUCTING...
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-16 grid grid-cols-3 gap-6">
          <Stat icon={<ShieldAlert className="text-purple-400" />} label="Accuracy" value="99.4%" />
          <Stat icon={<Cpu className="text-indigo-400" />} label="Latency" value="<200ms" />
          <Stat icon={<BarChart3 className="text-pink-400" />} label="Processed" value="2.4M+" />
        </div>
      </div>

      <div className="lg:w-1/2 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10"
        >
          <div className="glass-card rounded-[2.5rem] p-8 aspect-square flex items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent"></div>
             <div className="relative w-full h-full flex flex-col justify-center gap-6">
                {[1, 2, 3].map((i) => (
                   <motion.div
                    key={i}
                    animate={{ x: [0, 10, 0], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3 + i, repeat: Infinity }}
                    className="h-16 w-full glass-card rounded-2xl flex items-center px-6"
                   >
                     <div className="w-10 h-10 rounded-full bg-purple-500/20 mr-4"></div>
                     <div className="flex-grow">
                        <div className="h-2 w-24 bg-white/20 rounded mb-2"></div>
                        <div className="h-2 w-16 bg-white/10 rounded"></div>
                     </div>
                     <div className="w-12 h-6 bg-purple-500/30 rounded-full"></div>
                   </motion.div>
                ))}
             </div>
             
             <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-10 right-10 bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center"
             >
                <span className="text-slate-900 text-xs font-bold uppercase tracking-widest mb-1">Risk Score</span>
                <span className="text-4xl font-black text-purple-600">84</span>
             </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex flex-col items-center lg:items-start">
    <div className="mb-2">{icon}</div>
    <span className="text-2xl font-bold text-white">{value}</span>
    <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{label}</span>
  </div>
);

export default Hero;
