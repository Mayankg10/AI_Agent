'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function SimpleChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
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

  const clearChat = () => {
    setMessages([]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                AI Assistant
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Powered by advanced AI
              </p>
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
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col justify-center items-center h-full">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                Welcome to AI Assistant
              </h3>
              <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                I'm here to help you with questions, provide information, and assist with various tasks. How can I help you today?
              </p>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex items-center justify-center flex-shrink-0 ${message.role === 'user' ? 'ml-4' : 'mr-4'}`}>
                  {message.role === 'user' ? (
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-500/25">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 shadow-lg shadow-slate-500/25">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <div
                  className={`rounded-3xl px-6 py-4 shadow-lg backdrop-blur-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-500/25'
                      : 'bg-white/80 border border-slate-200/50 text-slate-800 shadow-slate-500/10'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {message.content}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-xs font-medium ${
                      message.role === 'user' ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[85%] flex-row">
                <div className="flex items-center justify-center flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 shadow-lg shadow-slate-500/25">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="bg-white/80 border border-slate-200/50 rounded-3xl px-6 py-4 shadow-lg backdrop-blur-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-slate-200/60 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="w-full px-6 py-4 pr-20 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none min-h-[52px] max-h-32 text-sm font-medium placeholder-slate-400 text-slate-800 shadow-lg shadow-slate-500/5 transition-all duration-200"
                rows={1}
                disabled={isLoading}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/25 disabled:hover:scale-100"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mt-4">
            <p className="text-xs text-slate-500 font-medium">
              Press <kbd className="px-2 py-1 bg-slate-100 rounded-md text-slate-600 font-mono text-xs">Enter</kbd> to send • 
              <kbd className="px-2 py-1 bg-slate-100 rounded-md text-slate-600 font-mono text-xs ml-1">Shift+Enter</kbd> for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
