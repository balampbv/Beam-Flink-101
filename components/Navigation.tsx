import React from 'react';
import { Home, BookOpen, GitGraph, Cpu, Bug, Library, Sun, Moon } from 'lucide-react';
import { AppSection } from '../types';

interface NavProps {
  current: AppSection;
  onNavigate: (s: AppSection) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const NavItem = ({ section, icon: Icon, label, current, onClick }: any) => (
  <button
    onClick={() => onClick(section)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-2 ${
      current === section 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

export const Navigation: React.FC<NavProps> = ({ current, onNavigate, darkMode, toggleDarkMode }) => {
  return (
    <div className="w-20 lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-4 flex-shrink-0 h-screen sticky top-0 transition-colors duration-300">
      <div className="mb-8 px-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-rose-500 rounded-lg flex-shrink-0 shadow-lg shadow-orange-500/20" />
        <span className="font-bold text-lg text-slate-800 dark:text-slate-100 hidden lg:block">Beam<span className="text-slate-400">×</span>Flink</span>
      </div>

      <nav className="flex-1">
        <NavItem section={AppSection.HOME} icon={Home} label="Overview" current={current} onClick={onNavigate} />
        <NavItem section={AppSection.CONCEPTS} icon={BookOpen} label="Concepts" current={current} onClick={onNavigate} />
        <NavItem section={AppSection.PIPELINE} icon={GitGraph} label="Pipeline Builder" current={current} onClick={onNavigate} />
        <NavItem section={AppSection.FLINK_SIM} icon={Cpu} label="Flink Cluster" current={current} onClick={onNavigate} />
        <NavItem section={AppSection.DEBUG} icon={Bug} label="Debug Lab" current={current} onClick={onNavigate} />
        <NavItem section={AppSection.GLOSSARY} icon={Library} label="Glossary" current={current} onClick={onNavigate} />
      </nav>

      <div className="mt-auto space-y-4">
        <button 
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="hidden lg:inline text-sm font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hidden lg:block border border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 leading-relaxed">
            Built for interactive learning. No backend required.
          </p>
        </div>
      </div>
    </div>
  );
};