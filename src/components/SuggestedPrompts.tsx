'use client';

interface SuggestedPromptsProps {
  onPromptClick: (prompt: string) => void;
}

const SUGGESTED_PROMPTS = [
  "Help me write a professional email",
  "Explain quantum computing in simple terms",
  "Create a workout plan for beginners",
  "Generate a recipe with chicken and vegetables",
  "Help me plan a weekend trip",
  "Write a thank you message",
];

export default function SuggestedPrompts({ onPromptClick }: SuggestedPromptsProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-sm text-slate-600 mb-4 text-center font-medium">
        ✨ Popular starting points:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SUGGESTED_PROMPTS.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            className="group text-left p-4 text-sm bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl hover:bg-white hover:border-blue-300/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] font-medium text-slate-700 hover:text-blue-700"
          >
            <div className="flex items-center justify-between">
              <span className="flex-1">{prompt}</span>
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
