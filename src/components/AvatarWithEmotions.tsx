'use client';

import { useState, useEffect } from 'react';
import { Bot, Smile, Lightbulb, Zap, Coffee, Star, Sun, Moon, Brain, Sparkles, Heart, Laugh, Meh } from 'lucide-react';

export type AvatarEmotion = 'neutral' | 'happy' | 'thinking' | 'excited' | 'helpful' | 'creative' | 'energetic' | 'sleepy' | 'smart' | 'joyful' | 'confused' | 'loving';

interface AvatarWithEmotionsProps {
  emotion?: AvatarEmotion;
  size?: 'small' | 'medium' | 'large';
  isTyping?: boolean;
  theme?: string;
}

const emotionConfig = {
  neutral: {
    icon: Bot,
    bgGradient: 'from-blue-500 to-indigo-600',
    shadowColor: 'shadow-blue-500/25',
    animation: '',
    eyeColor: 'bg-white',
    pupilAnimation: ''
  },
  happy: {
    icon: Smile,
    bgGradient: 'from-green-500 to-emerald-600',
    shadowColor: 'shadow-green-500/25',
    animation: 'animate-pulse',
    eyeColor: 'bg-yellow-300',
    pupilAnimation: 'animate-bounce'
  },
  thinking: {
    icon: Lightbulb,
    bgGradient: 'from-yellow-500 to-orange-600',
    shadowColor: 'shadow-yellow-500/25',
    animation: 'animate-pulse',
    eyeColor: 'bg-blue-300',
    pupilAnimation: 'animate-ping'
  },
  excited: {
    icon: Zap,
    bgGradient: 'from-purple-500 to-violet-600',
    shadowColor: 'shadow-purple-500/25',
    animation: 'animate-bounce',
    eyeColor: 'bg-purple-300',
    pupilAnimation: 'animate-spin'
  },
  helpful: {
    icon: Star,
    bgGradient: 'from-green-500 to-emerald-600',
    shadowColor: 'shadow-green-500/25',
    animation: 'animate-pulse',
    eyeColor: 'bg-green-300',
    pupilAnimation: 'animate-pulse'
  },
  creative: {
    icon: Sun,
    bgGradient: 'from-orange-500 to-red-600',
    shadowColor: 'shadow-orange-500/25',
    animation: 'animate-spin',
    eyeColor: 'bg-orange-300',
    pupilAnimation: 'animate-bounce'
  },
  energetic: {
    icon: Coffee,
    bgGradient: 'from-amber-500 to-yellow-600',
    shadowColor: 'shadow-amber-500/25',
    animation: 'animate-bounce',
    eyeColor: 'bg-amber-300',
    pupilAnimation: 'animate-pulse'
  },
  smart: {
    icon: Brain,
    bgGradient: 'from-blue-600 to-cyan-600',
    shadowColor: 'shadow-cyan-500/25',
    animation: 'animate-blink',
    eyeColor: 'bg-cyan-300',
    pupilAnimation: 'animate-pulse'
  },
  joyful: {
    icon: Laugh,
    bgGradient: 'from-yellow-300 to-yellow-500',
    shadowColor: 'shadow-yellow-400/25',
    animation: 'animate-bounce',
    eyeColor: 'bg-yellow-200',
    pupilAnimation: 'animate-spin'
  },
  confused: {
    icon: Meh,
    bgGradient: 'from-gray-400 to-gray-600',
    shadowColor: 'shadow-gray-500/25',
    animation: 'animate-shake',
    eyeColor: 'bg-gray-300',
    pupilAnimation: 'animate-wobble'
  },
  loving: {
    icon: Heart,
    bgGradient: 'from-pink-500 to-red-600',
    shadowColor: 'shadow-pink-500/25',
    animation: 'animate-pulse',
    eyeColor: 'bg-pink-300',
    pupilAnimation: 'animate-bounce'
  },
  sleepy: {
    icon: Moon,
    bgGradient: 'from-slate-500 to-gray-600',
    shadowColor: 'shadow-slate-500/25',
    animation: 'animate-pulse',
    eyeColor: 'bg-slate-300',
    pupilAnimation: ''
  }
};

const sizeConfig = {
  small: {
    container: 'w-8 h-8',
    icon: 'w-4 h-4',
    eyes: 'w-1 h-1',
    eyeContainer: 'w-3 h-3'
  },
  medium: {
    container: 'w-12 h-12',
    icon: 'w-6 h-6',
    eyes: 'w-1.5 h-1.5',
    eyeContainer: 'w-4 h-4'
  },
  large: {
    container: 'w-16 h-16',
    icon: 'w-8 h-8',
    eyes: 'w-2 h-2',
    eyeContainer: 'w-5 h-5'
  }
};

export default function AvatarWithEmotions({ 
  emotion = 'neutral', 
  size = 'medium', 
  isTyping = false,
  theme = 'default'
}: AvatarWithEmotionsProps) {
  const [currentEmotion, setCurrentEmotion] = useState<AvatarEmotion>(emotion);
  const [showEyes, setShowEyes] = useState(false);
  
  const config = emotionConfig[currentEmotion];
  const sizeSettings = sizeConfig[size];
  const IconComponent = config.icon;

  useEffect(() => {
    setCurrentEmotion(emotion);
  }, [emotion]);

  // Toggle between icon and eyes for more personality
  useEffect(() => {
    const interval = setInterval(() => {
      setShowEyes(prev => !prev);
    }, 3000 + Math.random() * 2000); // Random interval between 3-5 seconds

    return () => clearInterval(interval);
  }, []);

  // Theme-based adjustments
  const getThemeStyles = () => {
    switch (theme) {
      case 'neon':
        return {
          container: 'border-2 border-cyan-400 shadow-cyan-400/50 shadow-2xl',
          gradient: 'from-cyan-500 to-purple-600',
          glow: 'shadow-2xl shadow-cyan-500/50'
        };
      case 'retro':
        return {
          container: 'border-2 border-orange-400 shadow-orange-400/50',
          gradient: 'from-orange-500 to-pink-600',
          glow: 'shadow-xl shadow-orange-500/40'
        };
      case 'nature':
        return {
          container: 'border-2 border-green-400 shadow-green-400/50',
          gradient: 'from-green-500 to-emerald-600',
          glow: 'shadow-xl shadow-green-500/40'
        };
      case 'dark':
        return {
          container: 'border-2 border-slate-600 shadow-slate-600/50',
          gradient: 'from-slate-600 to-slate-800',
          glow: 'shadow-xl shadow-slate-500/40'
        };
      default:
        return {
          container: '',
          gradient: config.bgGradient,
          glow: config.shadowColor
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div className="relative">
      <div
        className={`
          ${sizeSettings.container} 
          bg-gradient-to-br ${themeStyles.gradient} 
          rounded-2xl flex items-center justify-center 
          shadow-lg ${themeStyles.glow}
          transition-all duration-300 
          ${config.animation}
          ${themeStyles.container}
          ${isTyping ? 'animate-pulse' : ''}
        `}
      >
        {showEyes && !isTyping ? (
          // Animated eyes
          <div className="flex space-x-1">
            <div className={`${sizeSettings.eyeContainer} ${config.eyeColor} rounded-full flex items-center justify-center`}>
              <div className={`${sizeSettings.eyes} bg-slate-800 rounded-full ${config.pupilAnimation}`} />
            </div>
            <div className={`${sizeSettings.eyeContainer} ${config.eyeColor} rounded-full flex items-center justify-center`}>
              <div className={`${sizeSettings.eyes} bg-slate-800 rounded-full ${config.pupilAnimation}`} />
            </div>
          </div>
        ) : (
          // Icon
          <IconComponent className={`${sizeSettings.icon} text-white`} />
        )}
      </div>
      
      {/* Emotion indicator */}
      {size === 'large' && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white animate-pulse" />
      )}
      
      {/* Typing indicator dots */}
      {isTyping && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
    </div>
  );
}

// Utility function to detect emotion from message content
export function detectMessageEmotion(content: string): AvatarEmotion {
  const lowerContent = content.toLowerCase();
  
  // Loving words
  if (lowerContent.includes('love') || lowerContent.includes('❤️') || lowerContent.includes('heart') || 
      lowerContent.includes('adore') || lowerContent.includes('cherish')) {
    return 'loving';
  }
  
  // Joyful words
  if (lowerContent.includes('haha') || lowerContent.includes('lol') || lowerContent.includes('funny') || 
      lowerContent.includes('laugh') || lowerContent.includes('hilarious') || lowerContent.includes('joy')) {
    return 'joyful';
  }
  
  // Smart/analytical words
  if (lowerContent.includes('algorithm') || lowerContent.includes('data') || lowerContent.includes('analysis') || 
      lowerContent.includes('research') || lowerContent.includes('study') || lowerContent.includes('intelligent') ||
      lowerContent.includes('complex') || lowerContent.includes('technical')) {
    return 'smart';
  }
  
  // Confused words
  if (lowerContent.includes('confused') || lowerContent.includes('unclear') || lowerContent.includes('dont understand') ||
      lowerContent.includes("don't understand") || lowerContent.includes('what') || lowerContent.includes('huh') ||
      lowerContent.includes('???')) {
    return 'confused';
  }
  
  // Excited words
  if (lowerContent.includes('!') || lowerContent.includes('wow') || lowerContent.includes('amazing') || 
      lowerContent.includes('awesome') || lowerContent.includes('fantastic') || lowerContent.includes('incredible')) {
    return 'excited';
  }
  
  // Happy words
  if (lowerContent.includes('😊') || lowerContent.includes('happy') || lowerContent.includes('great') || 
      lowerContent.includes('good') || lowerContent.includes('nice') || lowerContent.includes('excellent')) {
    return 'happy';
  }
  
  // Thinking words
  if (lowerContent.includes('think') || lowerContent.includes('consider') || lowerContent.includes('analyze') || 
      lowerContent.includes('let me') || lowerContent.includes('hmm') || lowerContent.includes('reasoning')) {
    return 'thinking';
  }
  
  // Helpful words
  if (lowerContent.includes('help') || lowerContent.includes('assist') || lowerContent.includes('support') || 
      lowerContent.includes('guide') || lowerContent.includes('here\'s how') || lowerContent.includes('solution')) {
    return 'helpful';
  }
  
  // Creative words
  if (lowerContent.includes('creative') || lowerContent.includes('idea') || lowerContent.includes('imagine') || 
      lowerContent.includes('design') || lowerContent.includes('art') || lowerContent.includes('innovative')) {
    return 'creative';
  }
  
  // Energetic words
  if (lowerContent.includes('energy') || lowerContent.includes('fast') || lowerContent.includes('quick') || 
      lowerContent.includes('speed') || lowerContent.includes('go') || lowerContent.includes('action')) {
    return 'energetic';
  }
  
  // Sleepy words
  if (lowerContent.includes('tired') || lowerContent.includes('sleep') || lowerContent.includes('rest') || 
      lowerContent.includes('slow') || lowerContent.includes('calm') || lowerContent.includes('peaceful')) {
    return 'sleepy';
  }
  
  return 'neutral';
}
