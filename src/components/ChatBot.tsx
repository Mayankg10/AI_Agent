'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Trash2, Copy, Check } from 'lucide-react';
import SuggestedPrompts from './SuggestedPrompts';
import KeyboardShortcuts from './KeyboardShortcuts';
import TypingIndicator from './TypingIndicator';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newMessageId, setNewMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (newMessageId) {
      const timer = setTimeout(() => {
        setNewMessageId(null);
      }, 300); // Clear after animation duration
      return () => clearTimeout(timer);
    }
  }, [newMessageId]);

  useEffect(() => {
    // Set initial textarea height on mount
    adjustTextareaHeight();
  }, []);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      // Set minimum height to prevent scrollbar when empty
      const minHeight = 52; // Approximate height for single row with padding
      textareaRef.current.style.height = `${Math.max(scrollHeight, minHeight)}px`;
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setNewMessageId(userMessage.id);
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message.content,
        role: 'assistant',
        timestamp: new Date(),
      };

      setNewMessageId(assistantMessage.id);
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error:', error);
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (error.message) {
        if (error.message.includes('API key not configured')) {
          errorMessage = '🔑 Please add your OpenAI API key to the .env.local file and restart the server.';
        } else if (error.message.includes('Invalid OpenAI API key')) {
          errorMessage = '❌ Invalid API key. Please check your OpenAI API key in .env.local file.';
        } else if (error.message.includes('Rate limit')) {
          errorMessage = '⏱️ Rate limit exceeded. Please wait a moment and try again.';
        } else if (error.message.includes('401')) {
          errorMessage = '🚫 Authentication failed. Please check your OpenAI API key.';
        } else {
          errorMessage = `❗ Error: ${error.message}`;
        }
      }
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        role: 'assistant',
        timestamp: new Date(),
      };
      setNewMessageId(errorMsg.id);
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

  const clearChat = () => {
    setMessages([]);
  };

  const copyMessage = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
      adjustTextareaHeight();
    }
  };

  const focusInput = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Bot className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">AI Assistant</h1>
              <p className="text-sm text-slate-500 hidden sm:block font-medium">Powered by advanced AI</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50/80 rounded-xl transition-all duration-200 hover:scale-105"
              title="Clear chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col justify-center items-center h-full min-h-0">
            <div className="text-center max-w-2xl mx-auto animate-fade-in">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/25">
                  <Bot className="w-8 h-8 text-white" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
                Welcome to AI Assistant
              </h3>
              <p className="text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
                I'm your intelligent companion, ready to help with questions, creative writing, analysis, and much more.
              </p>
              <SuggestedPrompts onPromptClick={handlePromptClick} />
            </div>
          </div>
        )}
        
        <div className="space-y-6">

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex message-container ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${
              message.id === newMessageId ? 'animate-fade-in-up' : ''
            }`}
          >
            <div
              className={`flex max-w-[85%] sm:max-w-[75%] ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 ml-4 shadow-blue-500/25' 
                    : 'bg-gradient-to-br from-slate-100 to-slate-200 mr-4 shadow-slate-500/10'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-slate-600" />
                )}
              </div>
              <div
                className={`rounded-3xl px-6 py-4 shadow-lg backdrop-blur-sm ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-500/25'
                    : 'bg-white/80 text-slate-800 border border-slate-200/50 shadow-slate-500/10'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {message.content}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span
                    className={`text-xs font-medium ${
                      message.role === 'user' 
                        ? 'text-blue-100' 
                        : 'text-slate-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => copyMessage(message.content, message.id)}
                      className="ml-3 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-xl transition-all duration-200 hover:scale-105"
                      title="Copy message"
                    >
                      {copiedId === message.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

          {isLoading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-slate-200/60 px-4 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  adjustTextareaHeight();
                }}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="w-full px-6 py-4 pr-20 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none min-h-[52px] max-h-32 text-sm font-medium placeholder-slate-400 shadow-lg shadow-slate-500/5 transition-all duration-200"
                rows={1}
                disabled={isLoading}
                style={{ overflow: 'hidden' }}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2.5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/25 disabled:hover:scale-100"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center mt-4 space-x-6">
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Press <kbd className="px-2 py-1 bg-slate-100 rounded-md text-slate-600 font-mono text-xs">Enter</kbd> to send • 
              <kbd className="px-2 py-1 bg-slate-100 rounded-md text-slate-600 font-mono text-xs">Shift+Enter</kbd> for new line • 
              <kbd className="px-2 py-1 bg-slate-100 rounded-md text-slate-600 font-mono text-xs">Ctrl+K</kbd> to focus
            </p>
            <p className="text-xs text-slate-500 font-medium sm:hidden">
              Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono text-xs">Enter</kbd> to send
            </p>
          </div>
        </div>
      </div>
      
      <KeyboardShortcuts onClearChat={clearChat} onFocusInput={focusInput} />
    </div>
  );
}
