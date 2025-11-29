import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Zap, Network } from 'lucide-react';
import { AppSection } from '../../types';

interface HeroProps {
  setSection: (s: AppSection) => void;
}

export const Hero: React.FC<HeroProps> = ({ setSection }) => {
  return (
    <div className="min-h-full flex flex-col items-center justify-center p-8 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 mb-16"
      >
        <div className="flex justify-center gap-4 mb-4">
            <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-semibold tracking-wide border border-orange-200 dark:border-orange-800">Apache Beam</span>
            <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-full text-sm font-semibold tracking-wide border border-rose-200 dark:border-rose-800">Apache Flink</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Write Once, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
            Run Distributed.
          </span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Interactive visualization of the relationship between the <strong>Beam Model</strong> (the what) and the <strong>Flink Runner</strong> (the how).
        </p>
        
        <div className="flex gap-4 justify-center mt-8">
            <button 
                onClick={() => setSection(AppSection.CONCEPTS)}
                className="px-8 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-bold shadow-xl hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all flex items-center gap-2 group"
            >
                Start Learning <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
                onClick={() => setSection(AppSection.PIPELINE)}
                className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-bold shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
                Try Simulator
            </button>
        </div>
      </motion.div>

      {/* Interactive Diagram */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 md:p-12 overflow-hidden relative transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-rose-500" />
        <h3 className="text-center text-slate-400 dark:text-slate-500 font-medium mb-12 uppercase tracking-widest text-sm">The Unified Model</h3>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            {/* Step 1: User Code */}
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center relative min-h-[160px] flex flex-col items-center justify-center backdrop-blur-sm"
            >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-4">
                    <Layers className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">1. Beam Model</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Pipelines, PCollections, Transforms (ParDo, GroupBy)</p>
            </motion.div>

            <ArrowRight className="text-slate-300 dark:text-slate-600 w-8 h-8 hidden md:block" />

            {/* Step 2: Translation */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center relative min-h-[160px] flex flex-col items-center justify-center backdrop-blur-sm"
            >
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mb-4">
                    <Network className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">2. Flink Runner</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Translates Beam graph into Flink JobGraph (DAG)</p>
            </motion.div>

            <ArrowRight className="text-slate-300 dark:text-slate-600 w-8 h-8 hidden md:block" />

            {/* Step 3: Execution */}
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center relative min-h-[160px] flex flex-col items-center justify-center backdrop-blur-sm"
            >
                <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">3. Distributed Run</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">JobManager schedules Tasks on TaskManager Slots</p>
                
                {/* Animation overlay */}
                <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 border-2 border-rose-200 dark:border-rose-500/30 rounded-xl" 
                />
            </motion.div>
        </div>
      </div>
    </div>
  );
};