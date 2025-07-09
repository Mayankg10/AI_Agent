'use client';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in-up">
      <div className="flex max-w-[85%] sm:max-w-[75%]">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg bg-gradient-to-br from-slate-100 to-slate-200 mr-4 shadow-slate-500/10">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 animate-pulse" />
        </div>
        <div className="bg-white/80 backdrop-blur-sm text-slate-800 border border-slate-200/50 shadow-lg shadow-slate-500/10 rounded-3xl px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm text-slate-600 font-medium">AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
