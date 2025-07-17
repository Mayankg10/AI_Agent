'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Play, 
  Lightbulb, 
  Target,
  MessageCircle,
  Settings,
  BarChart3,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Users,
  Bot,
  Zap,
  Shield
} from 'lucide-react';

// Onboarding step interface
interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  content: React.ReactNode;
  optional?: boolean;
}

// Main onboarding component
export const OnboardingFlow = ({ 
  steps, 
  onComplete, 
  onSkip,
  className = ""
}: {
  steps: OnboardingStep[];
  onComplete: () => void;
  onSkip?: () => void;
  className?: string;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const handleClose = () => {
    setIsVisible(false);
    onSkip?.();
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentStepData.title}</h2>
                <p className="text-blue-100 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-blue-100">Progress</span>
              <span className="text-sm font-medium">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <p className="text-gray-600 text-lg mb-6">{currentStepData.description}</p>
          
          <div className="bg-gray-50 rounded-xl p-6">
            {currentStepData.content}
          </div>

          {/* Tips section */}
          <div className="mt-6 bg-blue-50 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Pro Tip</h4>
                <p className="text-blue-800 text-sm">
                  {getProTip(currentStepData.id)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-blue-600'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex items-center space-x-3">
            {onSkip && (
              <button
                onClick={onSkip}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Skip Tour
              </button>
            )}
            
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>{currentStep === steps.length - 1 ? 'Finish' : 'Next'}</span>
              {currentStep === steps.length - 1 ? (
                <Check className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tooltip component
export const Tooltip = ({
  children,
  content,
  position = 'top',
  className = ""
}: {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = (e: React.MouseEvent) => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top;
      setTooltipPosition({ x, y });
      setIsVisible(true);
    }
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className={`inline-block ${className}`}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y - 40,
            transform: 'translateX(-50%)',
          }}
        >
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </>
  );
};

// Interactive tour component
export const InteractiveTour = ({
  steps,
  onComplete,
  className = ""
}: {
  steps: Array<{
    selector: string;
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
  }>;
  onComplete: () => void;
  className?: string;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (isActive && currentStep < steps.length) {
      const element = document.querySelector(steps[currentStep].selector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, isActive, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsActive(false);
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    setIsActive(false);
    onComplete();
  };

  if (!isActive || currentStep >= steps.length) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className={`fixed inset-0 z-50 ${className}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Tour popup */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentStepData.title}
            </h3>
            <button
              onClick={handleSkip}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">{currentStepData.content}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {currentStep + 1} of {steps.length}
              </span>
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Feature announcement component
export const FeatureAnnouncement = ({
  title,
  description,
  features,
  onDismiss,
  onGetStarted,
  className = ""
}: {
  title: string;
  description: string;
  features: Array<{
    icon: React.ElementType;
    title: string;
    description: string;
  }>;
  onDismiss: () => void;
  onGetStarted: () => void;
  className?: string;
}) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-blue-100">{description}</p>
              </div>
            </div>
            <button 
              onClick={onDismiss}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onDismiss}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Maybe Later
          </button>
          <button
            onClick={onGetStarted}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get pro tips
const getProTip = (stepId: string): string => {
  const tips: Record<string, string> = {
    'setup': 'Take your time with the initial setup - a well-configured chatbot performs much better.',
    'customization': 'Match your brand colors and voice to create a cohesive user experience.',
    'integration': 'Test the integration on different devices to ensure it works perfectly.',
    'analytics': 'Check your analytics regularly to understand user behavior and optimize responses.',
    'training': 'The more you train your chatbot, the better it becomes at handling user queries.',
    'deployment': 'Start with a soft launch to a small group of users before going live to everyone.',
  };
  
  return tips[stepId] || 'Follow the steps carefully for the best results.';
};

// Quick help tooltip
export const QuickHelp = ({
  title,
  content,
  className = ""
}: {
  title: string;
  content: string;
  className?: string;
}) => {
  return (
    <Tooltip content={content} className={className}>
      <div className="inline-flex items-center space-x-1 text-gray-500 hover:text-gray-700 cursor-help">
        <span className="text-sm">{title}</span>
        <HelpCircle className="w-4 h-4" />
      </div>
    </Tooltip>
  );
};

// Progress indicator
export const ProgressIndicator = ({
  steps,
  currentStep,
  className = ""
}: {
  steps: string[];
  currentStep: number;
  className?: string;
}) => {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            index < currentStep
              ? 'bg-green-500 text-white'
              : index === currentStep
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-500'
          }`}>
            {index < currentStep ? (
              <Check className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </div>
          <span className={`ml-2 text-sm ${
            index <= currentStep ? 'text-gray-900' : 'text-gray-500'
          }`}>
            {step}
          </span>
          {index < steps.length - 1 && (
            <div className={`w-8 h-0.5 mx-4 ${
              index < currentStep ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};
