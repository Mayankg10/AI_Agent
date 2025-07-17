'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Star, Heart, Zap, Sparkles } from 'lucide-react';

// Fade in animation wrapper
export const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 500, 
  className = "" 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  duration?: number; 
  className?: string; 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={ref}
      className={`transition-all duration-${duration} ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
};

// Slide in from direction
export const SlideIn = ({ 
  children, 
  direction = 'left', 
  delay = 0, 
  className = "" 
}: { 
  children: React.ReactNode; 
  direction?: 'left' | 'right' | 'up' | 'down'; 
  delay?: number; 
  className?: string; 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    
    switch (direction) {
      case 'left':
        return 'translate3d(-16px, 0, 0)';
      case 'right':
        return 'translate3d(16px, 0, 0)';
      case 'up':
        return 'translate3d(0, -16px, 0)';
      case 'down':
        return 'translate3d(0, 16px, 0)';
      default:
        return 'translate3d(-16px, 0, 0)';
    }
  };

  return (
    <div 
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={{
        transform: getTransform(),
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
};

// Scale animation
export const ScaleIn = ({ 
  children, 
  delay = 0, 
  className = "" 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string; 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={ref}
      className={`transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={{
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
};

// Stagger animation for lists
export const StaggerList = ({ 
  children, 
  staggerDelay = 100, 
  className = "" 
}: { 
  children: React.ReactNode[]; 
  staggerDelay?: number; 
  className?: string; 
}) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn key={index} delay={index * staggerDelay}>
          {child}
        </FadeIn>
      ))}
    </div>
  );
};

// Hover scale animation
export const HoverScale = ({ 
  children, 
  scale = 1.05, 
  className = "" 
}: { 
  children: React.ReactNode; 
  scale?: number; 
  className?: string; 
}) => (
  <div 
    className={`transition-transform duration-200 hover:scale-${Math.round(scale * 100)} ${className}`}
  >
    {children}
  </div>
);

// Animated button with pulse effect
export const PulseButton = ({ 
  children, 
  onClick, 
  className = "",
  variant = "primary"
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string;
  variant?: "primary" | "secondary";
}) => {
  const baseClasses = "relative overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg";
  const variantClasses = variant === "primary" 
    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
    : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50";

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
    </button>
  );
};

// Expandable/Collapsible content
export const Expandable = ({ 
  title, 
  children, 
  defaultOpen = false,
  className = ""
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-gray-200 rounded-lg ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pb-4 pt-2">
          {children}
        </div>
      </div>
    </div>
  );
};

// Floating action button with animation
export const FloatingActionButton = ({ 
  icon: Icon, 
  onClick, 
  className = "",
  position = "bottom-right"
}: { 
  icon: React.ElementType; 
  onClick: () => void; 
  className?: string;
  position?: "bottom-right" | "bottom-left";
}) => {
  const positionClasses = position === "bottom-right" 
    ? "bottom-6 right-6" 
    : "bottom-6 left-6";

  return (
    <button
      onClick={onClick}
      className={`
        fixed ${positionClasses} z-50
        w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 
        text-white rounded-full shadow-2xl
        hover:shadow-3xl hover:scale-110 
        transition-all duration-300 transform
        flex items-center justify-center
        ${className}
      `}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
};

// Animated counter
export const AnimatedCounter = ({ 
  value, 
  duration = 2000, 
  className = "" 
}: { 
  value: number; 
  duration?: number; 
  className?: string; 
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          
          const startTime = Date.now();
          const startValue = 0;
          const endValue = value;
          
          const updateCount = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
            
            setCount(currentValue);
            
            if (progress < 1) {
              requestAnimationFrame(updateCount);
            }
          };
          
          requestAnimationFrame(updateCount);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration, isVisible]);

  return (
    <span ref={ref} className={className}>
      {count}
    </span>
  );
};

// Animated progress bar
export const AnimatedProgressBar = ({ 
  progress, 
  className = "",
  color = "bg-blue-600"
}: { 
  progress: number; 
  className?: string;
  color?: string;
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          setTimeout(() => setAnimatedProgress(progress), 100);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [progress, isVisible]);

  return (
    <div ref={ref} className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div 
        className={`${color} h-2 rounded-full transition-all duration-1000 ease-out`}
        style={{ width: `${animatedProgress}%` }}
      />
    </div>
  );
};

// Particle animation background
export const ParticleBackground = ({ 
  particleCount = 50,
  className = ""
}: { 
  particleCount?: number;
  className?: string;
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 10 + 5,
    }));
    setParticles(newParticles);
  }, [particleCount]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-blue-400 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `float ${particle.duration}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
};

// Typewriter effect
export const Typewriter = ({ 
  text, 
  speed = 50, 
  className = "" 
}: { 
  text: string; 
  speed?: number; 
  className?: string; 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Animated icon with bounce effect
export const AnimatedIcon = ({ 
  icon: Icon, 
  className = "",
  animation = "bounce"
}: { 
  icon: React.ElementType; 
  className?: string;
  animation?: "bounce" | "pulse" | "spin" | "ping";
}) => {
  const animationClasses = {
    bounce: "animate-bounce",
    pulse: "animate-pulse",
    spin: "animate-spin",
    ping: "animate-ping"
  };

  return (
    <div className={`inline-block ${animationClasses[animation]} ${className}`}>
      <Icon />
    </div>
  );
};

// Ripple effect button
export const RippleButton = ({ 
  children, 
  onClick, 
  className = "" 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string; 
}) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { x, y, id: Date.now() };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    onClick?.();
  };

  return (
    <button 
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white bg-opacity-30 rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
    </button>
  );
};

// Animated card flip
export const FlipCard = ({ 
  front, 
  back, 
  className = "" 
}: { 
  front: React.ReactNode; 
  back: React.ReactNode; 
  className?: string; 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`relative w-full h-full perspective-1000 cursor-pointer ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-600 transform-style-preserve-3d ${
        isFlipped ? 'rotate-y-180' : ''
      }`}>
        <div className="absolute inset-0 backface-hidden">
          {front}
        </div>
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          {back}
        </div>
      </div>
    </div>
  );
};

// Morphing shapes
export const MorphingShape = ({ 
  className = "" 
}: { 
  className?: string; 
}) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-ping opacity-75"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-blue-500 rounded-full animate-bounce opacity-50"></div>
  </div>
);
