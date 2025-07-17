'use client';

import { useState } from 'react';
import { 
  AlertCircle, 
  XCircle, 
  CheckCircle, 
  Info, 
  X, 
  RefreshCw, 
  AlertTriangle,
  Wifi,
  Server,
  Shield,
  Bug,
  Home,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// Toast notification types
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Toast container (would typically be managed by a context)
export const ToastContainer = ({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) => (
  <div className="fixed top-4 right-4 z-50 space-y-2">
    {toasts.map((toast) => (
      <ToastNotification key={toast.id} toast={toast} onRemove={onRemove} />
    ))}
  </div>
);

// Individual toast notification
export const ToastNotification = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };
  
  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };
  
  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };
  
  return (
    <div className={`
      ${isVisible ? 'animate-slide-in-right' : 'animate-slide-out-right'}
      ${getToastStyles(toast.type)}
      max-w-md w-full border rounded-lg shadow-lg p-4
      transform transition-all duration-300
    `}>
      <div className="flex items-start space-x-3">
        {getIcon(toast.type)}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{toast.title}</h4>
          <p className="text-sm mt-1 opacity-90">{toast.message}</p>
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          onClick={handleRemove}
          className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Inline error message
export const InlineError = ({ 
  message, 
  className = "",
  showIcon = true 
}: { 
  message: string; 
  className?: string;
  showIcon?: boolean;
}) => (
  <div className={`flex items-center space-x-2 text-red-600 text-sm ${className}`}>
    {showIcon && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
    <span>{message}</span>
  </div>
);

// Success message
export const InlineSuccess = ({ 
  message, 
  className = "",
  showIcon = true 
}: { 
  message: string; 
  className?: string;
  showIcon?: boolean;
}) => (
  <div className={`flex items-center space-x-2 text-green-600 text-sm ${className}`}>
    {showIcon && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
    <span>{message}</span>
  </div>
);

// Warning message
export const InlineWarning = ({ 
  message, 
  className = "",
  showIcon = true 
}: { 
  message: string; 
  className?: string;
  showIcon?: boolean;
}) => (
  <div className={`flex items-center space-x-2 text-yellow-600 text-sm ${className}`}>
    {showIcon && <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
    <span>{message}</span>
  </div>
);

// Info message
export const InlineInfo = ({ 
  message, 
  className = "",
  showIcon = true 
}: { 
  message: string; 
  className?: string;
  showIcon?: boolean;
}) => (
  <div className={`flex items-center space-x-2 text-blue-600 text-sm ${className}`}>
    {showIcon && <Info className="w-4 h-4 flex-shrink-0" />}
    <span>{message}</span>
  </div>
);

// Alert banner
export const AlertBanner = ({ 
  type = 'info',
  title,
  message,
  action,
  onDismiss,
  className = ""
}: {
  type?: ToastType;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  className?: string;
}) => {
  const getBannerStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };
  
  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };
  
  return (
    <div className={`${getBannerStyles(type)} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        {getIcon(type)}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{title}</h4>
          <p className="text-sm mt-1 opacity-90">{message}</p>
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline"
            >
              {action.label}
            </button>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Error boundary fallback component
export const ErrorFallback = ({ 
  error, 
  resetError, 
  title = "Something went wrong",
  showDetails = false 
}: { 
  error: Error; 
  resetError: () => void;
  title?: string;
  showDetails?: boolean;
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Bug className="w-8 h-8 text-red-600" />
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
      
      <p className="text-gray-600 mb-6">
        We're sorry, but something unexpected happened. Please try again.
      </p>
      
      {showDetails && (
        <details className="text-left bg-gray-50 rounded-lg p-3 mb-6">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
            Error Details
          </summary>
          <pre className="text-xs text-gray-600 overflow-auto">
            {error.message}
          </pre>
        </details>
      )}
      
      <div className="flex flex-col space-y-3">
        <button
          onClick={resetError}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
        
        <Link
          href="/"
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
        >
          <Home className="w-4 h-4" />
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  </div>
);

// Network error component
export const NetworkError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
      <Wifi className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Problem</h3>
    <p className="text-gray-600 mb-4 max-w-md">
      Unable to connect to our servers. Please check your internet connection and try again.
    </p>
    <button
      onClick={onRetry}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
    >
      <RefreshCw className="w-4 h-4" />
      <span>Retry</span>
    </button>
  </div>
);

// Server error component
export const ServerError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
      <Server className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Server Error</h3>
    <p className="text-gray-600 mb-4 max-w-md">
      Our servers are experiencing issues. We're working to fix this as quickly as possible.
    </p>
    <button
      onClick={onRetry}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
    >
      <RefreshCw className="w-4 h-4" />
      <span>Try Again</span>
    </button>
  </div>
);

// 404 Not Found component
export const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="max-w-md w-full text-center">
      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl font-bold text-blue-600">404</span>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
      
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <div className="flex flex-col space-y-3">
        <button
          onClick={() => window.history.back()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
        
        <Link
          href="/"
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
        >
          <Home className="w-4 h-4" />
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  </div>
);

// Form validation error
export const FieldError = ({ 
  error, 
  touched, 
  className = "" 
}: { 
  error?: string; 
  touched?: boolean;
  className?: string;
}) => {
  if (!error || !touched) return null;
  
  return (
    <div className={`flex items-center space-x-2 text-red-600 text-sm mt-1 ${className}`}>
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
};

// Permission denied component
export const PermissionDenied = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
      <Shield className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
    <p className="text-gray-600 mb-4 max-w-md">
      You don't have permission to access this resource. Please contact your administrator.
    </p>
    <Link
      href="/"
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
    >
      <Home className="w-4 h-4" />
      <span>Go Home</span>
    </Link>
  </div>
);
