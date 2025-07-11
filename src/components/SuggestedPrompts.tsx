'use client';

import { useState, useEffect } from 'react';
import { Code, BookOpen, Lightbulb, Briefcase, Heart, Zap, Brain, Coffee, Star, Rocket } from 'lucide-react';

interface SuggestedPromptsProps {
  onPromptClick: (prompt: string) => void;
}

interface PromptCategory {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  prompts: string[];
}

const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    name: "Productivity",
    icon: Briefcase,
    color: "blue",
    prompts: [
      "Help me create a daily schedule that maximizes productivity",
      "Write a professional email declining a meeting politely",
      "Create a project plan template for software development",
      "Help me organize my tasks using the Getting Things Done method",
      "Draft a follow-up email after a job interview",
      "Create a meeting agenda template for team standups"
    ]
  },
  {
    name: "Learning",
    icon: BookOpen,
    color: "green",
    prompts: [
      "Explain machine learning concepts for someone new to AI",
      "Create a study plan for learning Python programming",
      "Summarize the key principles of effective communication",
      "Explain blockchain technology using simple analogies",
      "Create flashcards for learning a new language",
      "Break down complex topics into digestible learning modules"
    ]
  },
  {
    name: "Creative",
    icon: Lightbulb,
    color: "purple",
    prompts: [
      "Help me brainstorm unique business ideas for 2024",
      "Write a compelling story opening in 100 words",
      "Generate creative social media content ideas",
      "Help me design a user-friendly mobile app interface",
      "Create a memorable brand slogan for my startup",
      "Suggest innovative solutions to reduce plastic waste"
    ]
  },
  {
    name: "Technical",
    icon: Code,
    color: "orange",
    prompts: [
      "Debug this JavaScript code and explain the issues",
      "Design a RESTful API for a social media platform",
      "Explain database optimization techniques",
      "Help me choose the right cloud architecture",
      "Review my code for security vulnerabilities",
      "Create a Docker setup for a Node.js application"
    ]
  },
  {
    name: "Wellness",
    icon: Heart,
    color: "pink",
    prompts: [
      "Create a personalized meditation routine for beginners",
      "Design a balanced meal plan for busy professionals",
      "Suggest exercises I can do during work breaks",
      "Help me develop better sleep habits",
      "Create a stress management strategy",
      "Plan a digital detox weekend schedule"
    ]
  },
  {
    name: "Innovation",
    icon: Rocket,
    color: "cyan",
    prompts: [
      "Analyze emerging trends in artificial intelligence",
      "Help me patent a new invention idea",
      "Create a go-to-market strategy for a tech startup",
      "Design a sustainable business model",
      "Evaluate the potential of renewable energy technologies",
      "Brainstorm solutions for smart city challenges"
    ]
  }
];

export default function SuggestedPrompts({ onPromptClick }: SuggestedPromptsProps) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [currentPrompts, setCurrentPrompts] = useState(PROMPT_CATEGORIES[categoryIndex].prompts);

  useEffect(() => {
    const interval = setInterval(() => {
      setCategoryIndex((prev) => (prev + 1) % PROMPT_CATEGORIES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Show only first 4 prompts for cleaner interface
    setCurrentPrompts(PROMPT_CATEGORIES[categoryIndex].prompts.slice(0, 4));
  }, [categoryIndex]);

  const CategoryIcon = PROMPT_CATEGORIES[categoryIndex].icon;

  const shufflePrompts = () => {
    const allPrompts = PROMPT_CATEGORIES[categoryIndex].prompts;
    const shuffled = [...allPrompts].sort(() => Math.random() - 0.5);
    setCurrentPrompts(shuffled.slice(0, 4));
  };

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { text: string; bg: string; border: string } } = {
      blue: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-300' },
      green: { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-300' },
      purple: { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-300' },
      orange: { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-300' },
      pink: { text: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-300' },
      cyan: { text: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-300' }
    };
    return colorMap[color] || colorMap.blue;
  };

  const colors = getColorClasses(PROMPT_CATEGORIES[categoryIndex].color);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-center items-center mb-4">
        <CategoryIcon className={`w-5 h-5 ${colors.text}`} />
        <p className="text-sm text-slate-600 dark:text-slate-400 ml-2 font-medium">
          {PROMPT_CATEGORIES[categoryIndex].name} Suggestions
        </p>
        <button
          onClick={shufflePrompts}
          className="ml-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="Shuffle prompts"
        >
          <Zap className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
        </button>
      </div>
      
      {/* Category selector */}
      <div className="flex justify-center flex-wrap gap-2 mb-4">
        {PROMPT_CATEGORIES.map((category, index) => {
          const isActive = index === categoryIndex;
          const Icon = category.icon;
          const categoryColors = getColorClasses(category.color);
          return (
            <button
              key={index}
              onClick={() => setCategoryIndex(index)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                isActive
                  ? `${categoryColors.bg} ${categoryColors.text} ${categoryColors.border} border`
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <Icon className="w-3 h-3 inline mr-1" />
              {category.name}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {currentPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            className="group text-left p-4 text-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:border-blue-300/50 dark:hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] font-medium text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <div className="flex items-center justify-between">
              <span className="flex-1">{prompt}</span>
              <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
