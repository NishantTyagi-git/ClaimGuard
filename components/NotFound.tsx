import React from 'react';
import { Home, Search, EyeOff, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface NotFoundProps {
  onReturn: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onReturn }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="container max-w-2xl relative">
        {/* Animated Background Elements */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -right-20 text-purple-500 pointer-events-none"
        >
          <Search size={240} />
        </motion.div>
        
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-20 -left-20 text-indigo-500 pointer-events-none"
        >
          <EyeOff size={200} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-[3rem] p-12 md:p-20 text-center relative z-10 overflow-hidden"
        >
          {/* Top Decorative Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>

          <div className="flex justify-center mb-8 relative">
            <div className="w-24 h-24 rounded-full bg-rose-500/10 flex items-center justify-center relative">
              <span className="text-4xl font-black text-rose-500">404</span>
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-rose-500/20 rounded-full blur-2xl"
              />
            </div>
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -top-2 -right-2"
            >
              <AlertCircle className="text-rose-400 w-8 h-8" />
            </motion.div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight uppercase">
            Page <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-500">Not Found</span>
          </h1>
          
          <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-sm mx-auto">
            The neural pathway you are attempting to access does not exist or has been relocated within the ClaimGuard network.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onReturn}
              className="inline-flex items-center gap-2 bg-white text-black hover:bg-rose-50 px-8 py-4 rounded-2xl text-base font-bold transition-all duration-200 shadow-xl shadow-white/5 group"
            >
              <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              Return to Homepage
            </button>
            <div className="px-6 py-2 border border-white/10 rounded-full text-xs font-mono text-gray-500">
              ERR_NODE_NOT_FOUND
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
