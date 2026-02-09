import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, LayoutDashboard, Activity, Info, Phone, Hammer, Search } from 'lucide-react';

interface NavbarProps {
  onNavigate: (target: 'landing' | 'dashboard' | 'construction' | 'not-found' | 'contact') => void;
  current: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, current }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/60 backdrop-blur-lg border-b border-white/10 h-16' : 'bg-transparent h-20'}`}>
      <div className="container mx-auto h-full px-6 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onNavigate('landing')}
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <Shield className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Claim<span className="text-purple-400 transition-colors group-hover:text-purple-300">Guard</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <NavItem 
            icon={<LayoutDashboard size={18} />} 
            label="Dashboard" 
            active={current === 'dashboard'} 
            onClick={() => onNavigate('dashboard')}
          />
          <NavItem 
            icon={<Activity size={18} />} 
            label="Live Stats" 
            construction 
            onClick={() => onNavigate('construction')}
            active={current === 'construction'}
          />
          <NavItem 
            icon={<Search size={18} />} 
            label="Explore" 
            onClick={() => onNavigate('not-found')}
            active={current === 'not-found'}
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('not-found')}
            className="hidden sm:block text-gray-400 hover:text-white px-4 py-2 transition-colors relative group"
          >
            Login
            <span className="absolute -top-1 -right-2 bg-yellow-500/20 text-yellow-500 text-[8px] px-1 rounded border border-yellow-500/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Access Denied</span>
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('contact')}
            className={`px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg transition-all ${current === 'contact' ? 'bg-white text-black' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20'}`}
          >
            <Phone size={16} />
            Support
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; construction?: boolean; onClick: () => void }> = ({ icon, label, active, construction, onClick }) => (
  <div className="relative group">
    <button 
      onClick={onClick} 
      className={`flex items-center gap-2 text-sm font-medium transition-colors ${active ? 'text-purple-400' : 'text-gray-400 hover:text-white'} ${construction ? 'cursor-help' : ''}`}
    >
      {icon}
      {label}
      {construction && <Hammer size={12} className="text-yellow-500/50" />}
    </button>
    {construction && (
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-yellow-600 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl">
        CLICK TO VIEW STATUS
      </div>
    )}
  </div>
);

export default Navbar;
