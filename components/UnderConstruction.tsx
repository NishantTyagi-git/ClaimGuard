import React from 'react';
import { Home, Hammer, Construction, Settings, Wrench } from "lucide-react";
import { motion } from "framer-motion";

interface UnderConstructionProps {
  onReturn: () => void;
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({ onReturn }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="container max-w-2xl relative">
        {/* Animated Background Icons */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 text-purple-500/10 pointer-events-none"
        >
          <Settings size={200} />
        </motion.div>
        
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-20 text-indigo-500/10 pointer-events-none"
        >
          <Wrench size={180} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[3rem] p-12 md:p-20 text-center relative z-10 overflow-hidden"
        >
          {/* Top Accent Ring */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

          <div className="flex justify-center mb-8 relative">
            <div className="w-24 h-24 rounded-3xl bg-purple-500/10 flex items-center justify-center relative">
              <Construction className="w-12 h-12 text-purple-500" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-purple-500/20 rounded-3xl blur-xl"
              />
            </div>
            <motion.div 
              animate={{ x: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-2 -right-2"
            >
              <Hammer className="text-yellow-500 w-8 h-8 rotate-12" />
            </motion.div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            UNDER <span className="text-gradient">CONSTRUCTION</span>
          </h1>
          
          <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-md mx-auto">
            Our engineers are currently refining this segment of the ClaimGuard Neural Network. This feature will be deployed in the next system update.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onReturn}
              className="inline-flex items-center gap-2 bg-white text-black hover:bg-purple-50 px-8 py-4 rounded-2xl text-base font-bold transition-all duration-200 shadow-xl shadow-white/5"
            >
              <Home className="w-5 h-5" />
              Return to Homepage
            </button>
            <div className="px-6 py-2 border border-white/10 rounded-full text-xs font-mono text-gray-500">
              BUILD ID: CG-X-2025
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UnderConstruction;
