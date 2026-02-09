import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FraudPredictor from './components/FraudPredictor';
import Footer from './components/Footer';
import WelcomeScreen from './components/WelcomeScreen';
import UnderConstruction from './components/UnderConstruction';
import NotFound from './components/NotFound';
import Contact from './components/Contact';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import { motion, AnimatePresence } from 'framer-motion';

type AppState = 'welcome' | 'landing' | 'dashboard' | 'construction' | 'not-found' | 'contact' | 'terms' | 'privacy';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');

  const handleNavigate = (target: AppState) => {
    setAppState(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#020617]">
      <AnimatePresence mode="wait">
        {appState === 'welcome' && (
          <WelcomeScreen key="welcome" onComplete={() => setAppState('landing')} />
        )}
      </AnimatePresence>

      {/* Main Content - Visible only after welcome */}
      {appState !== 'welcome' && (
        <>
          {/* Dynamic Background */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full"></div>
          </div>

          <Navbar onNavigate={handleNavigate} current={appState} />

          <main className="flex-grow relative z-10 pt-16">
            <AnimatePresence mode="wait">
              {appState === 'landing' ? (
                <motion.div
                  key="hero"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Hero onStart={() => setAppState('dashboard')} />
                </motion.div>
              ) : appState === 'dashboard' ? (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="container mx-auto px-4 py-8"
                >
                  <div className="mb-8">
                    <button
                      onClick={() => setAppState('landing')}
                      className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition-colors group"
                    >
                      <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span> 
                      Back to Overview
                    </button>
                    <h1 className="text-3xl font-bold text-white mb-2">Claim Risk Dashboard</h1>
                    <p className="text-gray-400">Enter policy details to generate an AI-driven fraud risk assessment.</p>
                  </div>
                  
                  <FraudPredictor />
                </motion.div>
              ) : appState === 'contact' ? (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                >
                  <Contact onReturn={() => setAppState('landing')} />
                </motion.div>
              ) : appState === 'terms' ? (
                <motion.div
                  key="terms"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <TermsOfService onReturn={() => setAppState('landing')} />
                </motion.div>
              ) : appState === 'privacy' ? (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <PrivacyPolicy onReturn={() => setAppState('landing')} />
                </motion.div>
              ) : appState === 'construction' ? (
                <motion.div
                  key="construction"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <UnderConstruction onReturn={() => setAppState('landing')} />
                </motion.div>
              ) : (
                <motion.div
                  key="not-found"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <NotFound onReturn={() => setAppState('landing')} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <Footer onNavigate={handleNavigate} />
        </>
      )}
    </div>
  );
};

export default App;
