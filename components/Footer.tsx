import React from 'react';
import { Hammer } from 'lucide-react';

interface FooterProps {
  onNavigate: (target: 'landing' | 'dashboard' | 'construction' | 'not-found' | 'terms' | 'privacy') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-black/40 border-t border-white/5 py-12 relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div 
              className="flex items-center gap-2 mb-4 cursor-pointer"
              onClick={() => onNavigate('landing')}
            >
              <span className="text-xl font-bold tracking-tight text-white">Claim<span className="text-purple-400">Guard</span></span>
            </div>
            <p className="text-gray-500 text-sm max-w-sm text-center md:text-left">
              Advanced insurance fraud analytics powered by Decision Tree heuristics and Gemini AI. Built for high-performance claim centers.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <FooterLink label="Dashboard" onClick={() => onNavigate('dashboard')} />
                <FooterLink label="API Reference" construction onClick={() => onNavigate('construction')} />
                <FooterLink label="Model History" construction onClick={() => onNavigate('construction')} />
                <FooterLink label="Broken Link" onClick={() => onNavigate('not-found')} />
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <FooterLink label="Privacy Policy" onClick={() => onNavigate('privacy')} />
                <FooterLink label="Terms of Use" onClick={() => onNavigate('terms')} />
                <FooterLink label="Compliance" construction onClick={() => onNavigate('construction')} />
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>© 2025 ClaimGuard Analytics. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> System Status: Healthy</span>
            <span>Version: 3.4.1-Stable</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink: React.FC<{ label: string; construction?: boolean; onClick: () => void }> = ({ label, construction, onClick }) => (
  <li className="flex items-center gap-1.5 group">
    <button onClick={onClick} className="hover:text-white transition-colors text-left">
      {label}
    </button>
    {construction && (
      <span className="text-[10px] text-yellow-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        [UNDER CONSTRUCTION]
      </span>
    )}
  </li>
);

export default Footer;
