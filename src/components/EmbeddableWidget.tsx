'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, MessageCircle, Minimize2 } from 'lucide-react';

interface WidgetConfig {
  businessId: string;
  businessName: string;
  primaryColor: string;
  accentColor: string;
  welcomeMessage: string;
  placeholder: string;
  position: 'bottom-right' | 'bottom-left';
  theme: 'light' | 'dark' | 'auto';
  size: 'small' | 'medium' | 'large';
  logo?: string;
  customCSS?: string;
  apiEndpoint?: string;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface EmbeddableWidgetProps {
  config: WidgetConfig;
  onMessage?: (message: Message) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export default function EmbeddableWidget({ 
  config, 
  onMessage, 
  onOpen, 
  onClose 
}: EmbeddableWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Size configurations
  const sizeConfig = {
    small: {
      widget: 'w-80 h-96',
      button: 'w-14 h-14',
      icon: 'w-6 h-6',
      text: 'text-sm'
    },
    medium: {
      widget: 'w-96 h-[32rem]',
      button: 'w-16 h-16',
      icon: 'w-7 h-7',
      text: 'text-base'
    },
    large: {
      widget: 'w-[28rem] h-[36rem]',
      button: 'w-20 h-20',
      icon: 'w-9 h-9',
      text: 'text-lg'
    }
  };

  const currentSize = sizeConfig[config.size] || sizeConfig.medium;

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (config.welcomeMessage && messages.length === 0) {
      const welcomeMsg: Message = {
        id: 'welcome',
        content: config.welcomeMessage,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages([welcomeMsg]);
    }
  }, [config.welcomeMessage]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    if (newState) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    onMessage?.(userMessage);

    try {
      const response = await fetch(config.apiEndpoint || '/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          businessId: config.businessId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      const assistantMsgId = Date.now().toString();

      const assistantMsg: Message = {
        id: assistantMsgId,
        content: '',
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                assistantMessage += data.content;
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMsgId 
                    ? { ...msg, content: assistantMessage }
                    : msg
                ));
              }
              if (data.finished) {
                break;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      const finalMsg: Message = {
        id: assistantMsgId,
        content: assistantMessage,
        role: 'assistant',
        timestamp: new Date()
      };
      
      onMessage?.(finalMsg);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg: Message = {
        id: Date.now().toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  return (
    <div 
      className={`fixed ${positionClasses[config.position]} z-50 font-sans`}
      style={{
        '--primary-color': config.primaryColor,
        '--accent-color': config.accentColor,
      } as React.CSSProperties}
    >
      {/* Chat Widget */}
      {isOpen && (
        <div 
          className={`${currentSize.widget} bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 mb-4 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? 'h-16' : ''
          }`}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
            style={{ backgroundColor: config.primaryColor }}
          >
            <div className="flex items-center space-x-3">
              {config.logo ? (
                <img 
                  src={config.logo} 
                  alt={config.businessName} 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <h3 className="text-white font-semibold text-sm">{config.businessName}</h3>
                <p className="text-white/80 text-xs">AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleToggle}
                className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${currentSize.text} ${
                        message.role === 'user'
                          ? 'text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      }`}
                      style={
                        message.role === 'user' 
                          ? { backgroundColor: config.primaryColor }
                          : {}
                      }
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={config.placeholder}
                    className={`flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600 px-3 py-2 focus:ring-2 focus:ring-opacity-50 focus:border-transparent ${currentSize.text} max-h-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                    style={{ 
                      borderColor: isLoading ? '#d1d5db' : undefined,
                      '--tw-ring-color': config.accentColor
                    } as React.CSSProperties}
                    rows={1}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading}
                    className="p-2 rounded-xl text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className={`${currentSize.button} rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-white flex items-center justify-center`}
        style={{ backgroundColor: config.primaryColor }}
      >
        {isOpen ? (
          <X className={currentSize.icon} />
        ) : (
          <MessageCircle className={currentSize.icon} />
        )}
      </button>
    </div>
  );
}
