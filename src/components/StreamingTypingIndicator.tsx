'use client';

import { Bot, Square } from 'lucide-react';

interface StreamingTypingIndicatorProps {
  content?: string;
  onStop?: () => void;
  canStop?: boolean;
}

export default function StreamingTypingIndicator({ 
  content = '', 
  onStop, 
  canStop = false 
}: StreamingTypingIndicatorProps) {
  return (
    <div className="flex justify-start animate-fade-in-up">
      <div className="flex max-w-[85%] sm:max-w-[75%]">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 mr-4 shadow-slate-500/10 dark:shadow-slate-900/20">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 animate-pulse" />
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-slate-500/10 dark:shadow-slate-900/20 rounded-3xl px-6 py-4 min-w-0 flex-1">
          {content ? (
            <div className="space-y-3">
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {content}
                <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse" />
              </div>
              {canStop && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    AI is responding...
                  </span>
                  <button
                    onClick={onStop}
                    className="flex items-center space-x-1 px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:scale-105"
                    title="Stop generation"
                  >
                    <Square className="w-3 h-3" />
                    <span>Stop</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">AI is thinking...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
