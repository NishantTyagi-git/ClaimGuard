import React from 'react';
import { motion } from 'framer-motion';

interface RiskGaugeProps {
  score: number;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ score }) => {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getStrokeColor = () => {
    if (score < 30) return "#10b981"; // green
    if (score < 70) return "#f59e0b"; // yellow/orange
    return "#f43f5e"; // rose/red
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90 w-56 h-56">
        <circle
          cx="112"
          cy="112"
          r={radius}
          stroke="currentColor"
          strokeWidth="14"
          fill="transparent"
          className="text-white/5"
        />
        <motion.circle
          cx="112"
          cy="112"
          r={radius}
          stroke={getStrokeColor()}
          strokeWidth="14"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-black text-white">{score}</span>
        <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Risk Score</span>
      </div>
    </div>
  );
};

export default RiskGauge;
