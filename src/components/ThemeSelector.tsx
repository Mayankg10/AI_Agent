'use client';

import { useState } from 'react';
import { Palette, Sparkles, Zap, Leaf, Moon, Sun, Monitor, Gamepad2 } from 'lucide-react';

export type ChatTheme = 'default' | 'neon' | 'retro' | 'nature' | 'dark' | 'light' | 'minimal' | 'gaming';

interface ThemeSelectorProps {
  currentTheme: ChatTheme;
  onThemeChange: (theme: ChatTheme) => void;
}

const themes = [
  {
    id: 'default' as ChatTheme,
    name: 'Default',
    icon: Monitor,
    description: 'Clean and modern',
    colors: {
      primary: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      secondary: 'bg-white',
      accent: 'text-blue-600'
    }
  },
  {
    id: 'neon' as ChatTheme,
    name: 'Neon',
    icon: Zap,
    description: 'Cyberpunk vibes',
    colors: {
      primary: 'bg-gradient-to-br from-cyan-500 to-purple-600',
      secondary: 'bg-slate-900',
      accent: 'text-cyan-400'
    }
  },
  {
    id: 'retro' as ChatTheme,
    name: 'Retro',
    icon: Sparkles,
    description: '80s aesthetic',
    colors: {
      primary: 'bg-gradient-to-br from-orange-500 to-pink-600',
      secondary: 'bg-purple-900',
      accent: 'text-orange-400'
    }
  },
  {
    id: 'nature' as ChatTheme,
    name: 'Nature',
    icon: Leaf,
    description: 'Earth tones',
    colors: {
      primary: 'bg-gradient-to-br from-green-500 to-emerald-600',
      secondary: 'bg-green-50',
      accent: 'text-green-600'
    }
  },
  {
    id: 'dark' as ChatTheme,
    name: 'Dark',
    icon: Moon,
    description: 'Sleek darkness',
    colors: {
      primary: 'bg-gradient-to-br from-slate-600 to-slate-800',
      secondary: 'bg-slate-900',
      accent: 'text-slate-400'
    }
  },
  {
    id: 'light' as ChatTheme,
    name: 'Light',
    icon: Sun,
    description: 'Bright and airy',
    colors: {
      primary: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      secondary: 'bg-yellow-50',
      accent: 'text-yellow-600'
    }
  },
  {
    id: 'minimal' as ChatTheme,
    name: 'Minimal',
    icon: Monitor,
    description: 'Less is more',
    colors: {
      primary: 'bg-gradient-to-br from-gray-500 to-gray-700',
      secondary: 'bg-gray-50',
      accent: 'text-gray-600'
    }
  },
  {
    id: 'gaming' as ChatTheme,
    name: 'Gaming',
    icon: Gamepad2,
    description: 'Gamer aesthetic',
    colors: {
      primary: 'bg-gradient-to-br from-red-500 to-purple-600',
      secondary: 'bg-black',
      accent: 'text-red-400'
    }
  }
];

export default function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 text-slate-400 hover:text-purple-600 hover:bg-purple-50/80 dark:hover:bg-purple-900/20 rounded-xl transition-all duration-200 hover:scale-105"
        title="Change theme"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-2xl shadow-slate-500/20 dark:shadow-slate-900/40 z-50 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Choose Theme</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => {
              const IconComponent = theme.icon;
              const isSelected = currentTheme === theme.id;
              
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    onThemeChange(theme.id);
                    setIsOpen(false);
                  }}
                  className={`
                    relative p-3 rounded-xl border-2 transition-all duration-200 text-left
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/25' 
                      : 'border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/80 dark:hover:bg-slate-700/50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-8 h-8 ${theme.colors.primary} rounded-lg flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-100 text-sm">
                        {theme.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {theme.description}
                      </div>
                    </div>
                  </div>
                  
                  {/* Theme preview */}
                  <div className="flex space-x-1 mt-2">
                    <div className={`w-4 h-2 ${theme.colors.primary} rounded-sm`} />
                    <div className={`w-4 h-2 ${theme.colors.secondary} border border-slate-200 dark:border-slate-700 rounded-sm`} />
                    <div className={`w-4 h-2 ${theme.colors.primary} opacity-60 rounded-sm`} />
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
            <div className="flex items-center space-x-2 mb-1">
              <div className={`w-4 h-4 ${currentThemeData.colors.primary} rounded-full`} />
              <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">
                Current: {currentThemeData.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentThemeData.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Theme configuration object for easy access
export const themeConfig = {
  default: {
    name: 'Default',
    background: 'bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900',
    header: 'bg-white/80 dark:bg-slate-800/80',
    messageUser: 'bg-gradient-to-br from-blue-600 to-indigo-700',
    messageBot: 'bg-white/80 dark:bg-slate-800/80',
    input: 'bg-white/80 dark:bg-slate-700/80',
    accent: 'blue'
  },
  neon: {
    name: 'Neon',
    background: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    header: 'bg-slate-900/80 border-cyan-400/30',
    messageUser: 'bg-gradient-to-br from-cyan-500 to-purple-600',
    messageBot: 'bg-slate-800/80 border-cyan-400/30',
    input: 'bg-slate-800/80 border-cyan-400/30',
    accent: 'cyan'
  },
  retro: {
    name: 'Retro',
    background: 'bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900',
    header: 'bg-purple-900/80 border-orange-400/30',
    messageUser: 'bg-gradient-to-br from-orange-500 to-pink-600',
    messageBot: 'bg-purple-800/80 border-orange-400/30',
    input: 'bg-purple-800/80 border-orange-400/30',
    accent: 'orange'
  },
  nature: {
    name: 'Nature',
    background: 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-100',
    header: 'bg-green-100/80 border-green-300/30',
    messageUser: 'bg-gradient-to-br from-green-500 to-emerald-600',
    messageBot: 'bg-green-50/80 border-green-300/30',
    input: 'bg-green-50/80 border-green-300/30',
    accent: 'green'
  },
  dark: {
    name: 'Dark',
    background: 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900',
    header: 'bg-slate-900/80 border-slate-600/30',
    messageUser: 'bg-gradient-to-br from-slate-600 to-slate-800',
    messageBot: 'bg-slate-800/80 border-slate-600/30',
    input: 'bg-slate-800/80 border-slate-600/30',
    accent: 'slate'
  },
  light: {
    name: 'Light',
    background: 'bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100',
    header: 'bg-yellow-100/80 border-yellow-300/30',
    messageUser: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    messageBot: 'bg-yellow-50/80 border-yellow-300/30',
    input: 'bg-yellow-50/80 border-yellow-300/30',
    accent: 'yellow'
  },
  minimal: {
    name: 'Minimal',
    background: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
    header: 'bg-white/80 border-gray-300/30',
    messageUser: 'bg-gradient-to-br from-gray-500 to-gray-700',
    messageBot: 'bg-gray-50/80 border-gray-300/30',
    input: 'bg-gray-50/80 border-gray-300/30',
    accent: 'gray'
  },
  gaming: {
    name: 'Gaming',
    background: 'bg-gradient-to-br from-black via-red-900 to-purple-900',
    header: 'bg-black/80 border-red-400/30',
    messageUser: 'bg-gradient-to-br from-red-500 to-purple-600',
    messageBot: 'bg-red-900/80 border-red-400/30',
    input: 'bg-red-900/80 border-red-400/30',
    accent: 'red'
  }
};
