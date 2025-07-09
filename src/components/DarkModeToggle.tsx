'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

interface DarkModeToggleProps {
  onToggle: (isDark: boolean) => void;
}

export default function DarkModeToggle({ onToggle }: DarkModeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('ai-chatbot-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(initialDark);
    onToggle(initialDark);
    
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [onToggle]);

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    onToggle(newDark);
    
    // Save preference
    localStorage.setItem('ai-chatbot-theme', newDark ? 'dark' : 'light');
    
    // Apply to document
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-3 text-slate-400 hover:text-amber-500 hover:bg-amber-50/80 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-200 hover:scale-105"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
