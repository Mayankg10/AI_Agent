'use client';

import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onClearChat: () => void;
  onFocusInput: () => void;
}

export default function KeyboardShortcuts({ onClearChat, onFocusInput }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus input
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onFocusInput();
      }
      
      // Ctrl/Cmd + Shift + L to clear chat
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        onClearChat();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClearChat, onFocusInput]);

  return null; // This component doesn't render anything
}
