import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from './components/Navigation';
import { Hero } from './components/sections/Hero';
import { Concepts } from './components/sections/Concepts';
import { PipelinePlayground } from './components/sections/PipelinePlayground';
import { FlinkSimulator } from './components/sections/FlinkSimulator';
import { DebugLessons } from './components/sections/DebugLessons';
import { Glossary } from './components/sections/Glossary';
import { Guide } from './components/sections/Guide';
import { AppSection } from './types';

const App: React.FC = () => {
  const [section, setSection] = useState<AppSection>(AppSection.HOME);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderSection = () => {
    switch (section) {
      case AppSection.HOME:
        return <Hero setSection={setSection} />;
      case AppSection.GUIDE:
        return <Guide />;
      case AppSection.CONCEPTS:
        return <Concepts />;
      case AppSection.PIPELINE:
        return <PipelinePlayground />;
      case AppSection.FLINK_SIM:
        return <FlinkSimulator />;
      case AppSection.DEBUG:
        return <DebugLessons />;
      case AppSection.GLOSSARY:
        return <Glossary />;
      default:
        return <Hero setSection={setSection} />;
    }
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Navigation 
        current={section} 
        onNavigate={setSection} 
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />
      
      <main className="flex-1 overflow-x-hidden relative h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;