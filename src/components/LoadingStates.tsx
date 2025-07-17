'use client';

import { Bot, MessageCircle, BarChart3, Users, Settings } from 'lucide-react';

// Skeleton loading animation
export const SkeletonLoader = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

// Pulse animation for avatars
export const SkeletonAvatar = ({ size = "w-10 h-10" }: { size?: string }) => (
  <div className={`${size} bg-gray-200 rounded-full animate-pulse`}></div>
);

// Loading spinner component
export const LoadingSpinner = ({ size = "w-8 h-8", color = "text-blue-600" }: { size?: string; color?: string }) => (
  <div className={`${size} ${color} animate-spin`}>
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
);

// Progress bar component
export const ProgressBar = ({ progress, className = "" }: { progress: number; className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div 
      className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
    />
  </div>
);

// Card skeleton for dashboard
export const CardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="space-y-2">
        <SkeletonLoader className="h-4 w-24" />
        <SkeletonLoader className="h-8 w-16" />
      </div>
      <SkeletonLoader className="w-12 h-12 rounded-lg" />
    </div>
    <div className="flex items-center mt-4">
      <SkeletonLoader className="h-3 w-12 mr-2" />
      <SkeletonLoader className="h-3 w-20" />
    </div>
  </div>
);

// Chat message skeleton
export const ChatMessageSkeleton = ({ isUser = false }: { isUser?: boolean }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex items-center justify-center flex-shrink-0 ${isUser ? 'ml-4' : 'mr-4'}`}>
        <SkeletonAvatar />
      </div>
      <div className={`rounded-3xl px-6 py-4 ${isUser ? 'bg-blue-100' : 'bg-gray-100'}`}>
        <div className="space-y-2">
          <SkeletonLoader className="h-3 w-32" />
          <SkeletonLoader className="h-3 w-24" />
          <SkeletonLoader className="h-3 w-28" />
        </div>
      </div>
    </div>
  </div>
);

// Dashboard grid skeleton
export const DashboardSkeleton = () => (
  <div className="space-y-8">
    {/* Header skeleton */}
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <SkeletonLoader className="h-8 w-64" />
        <SkeletonLoader className="h-4 w-48" />
      </div>
      <SkeletonLoader className="h-10 w-32 rounded-lg" />
    </div>
    
    {/* Stats cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
    
    {/* Content area skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <SkeletonLoader className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <SkeletonLoader className="h-4 w-48" />
              <SkeletonLoader className="h-4 w-8" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <SkeletonLoader className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <SkeletonLoader className="w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <SkeletonLoader className="h-4 w-32" />
                <SkeletonLoader className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Page loading overlay
export const PageLoadingOverlay = ({ message = "Loading..." }: { message?: string }) => (
  <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
        <Bot className="w-8 h-8 text-white animate-pulse" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{message}</h3>
        <div className="flex items-center justify-center space-x-2">
          <LoadingSpinner size="w-5 h-5" />
          <span className="text-gray-600">Please wait...</span>
        </div>
      </div>
    </div>
  </div>
);

// Button loading state
export const ButtonLoading = ({ 
  children, 
  loading = false, 
  disabled = false, 
  className = "",
  ...props 
}: {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  [key: string]: any;
}) => (
  <button 
    disabled={disabled || loading}
    className={`relative ${className} ${loading || disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
    {...props}
  >
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner size="w-4 h-4" color="text-current" />
      </div>
    )}
    <span className={loading ? 'invisible' : 'visible'}>
      {children}
    </span>
  </button>
);

// Typing indicator for chat
export const TypingIndicator = () => (
  <div className="flex items-center space-x-2 text-gray-500">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
    <span className="text-sm">AI is typing...</span>
  </div>
);

// Content placeholder
export const ContentPlaceholder = ({ 
  icon: Icon = MessageCircle, 
  title = "No content available",
  description = "There's nothing to show here yet.",
  actionLabel,
  onAction
}: {
  icon?: React.ElementType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4 max-w-md">{description}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

// Search loading state
export const SearchLoading = () => (
  <div className="flex items-center justify-center py-8">
    <div className="flex items-center space-x-3">
      <LoadingSpinner size="w-5 h-5" />
      <span className="text-gray-600">Searching...</span>
    </div>
  </div>
);
