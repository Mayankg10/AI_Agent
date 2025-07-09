'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Calendar, User, Bot, X, Hash, Clock } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isEdited?: boolean;
  feedback?: 'positive' | 'negative' | null;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

interface SearchFilters {
  query: string;
  role: 'all' | 'user' | 'assistant';
  dateRange: 'all' | 'today' | 'week' | 'month';
  hasCode: boolean;
  hasLinks: boolean;
  feedback: 'all' | 'positive' | 'negative' | 'none';
}

interface AdvancedSearchProps {
  conversations: Conversation[];
  onMessageSelect: (conversationId: string, messageId: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function AdvancedSearch({ 
  conversations, 
  onMessageSelect, 
  onClose, 
  isOpen 
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    role: 'all',
    dateRange: 'all',
    hasCode: false,
    hasLinks: false,
    feedback: 'all',
  });

  const [showFilters, setShowFilters] = useState(false);

  // Search and filter logic
  const searchResults = useMemo(() => {
    if (!filters.query.trim() && 
        filters.role === 'all' && 
        filters.dateRange === 'all' && 
        !filters.hasCode && 
        !filters.hasLinks && 
        filters.feedback === 'all') {
      return [];
    }

    const results: Array<{
      conversation: Conversation;
      message: Message;
      matchScore: number;
    }> = [];

    conversations.forEach(conversation => {
      conversation.messages.forEach(message => {
        let matchScore = 0;
        let matches = true;

        // Text search
        if (filters.query.trim()) {
          const query = filters.query.toLowerCase();
          const content = message.content.toLowerCase();
          if (content.includes(query)) {
            matchScore += 10;
            // Boost score for exact matches
            if (content.includes(query)) {
              matchScore += 5;
            }
          } else {
            matches = false;
          }
        }

        // Role filter
        if (filters.role !== 'all' && message.role !== filters.role) {
          matches = false;
        }

        // Date filter
        if (filters.dateRange !== 'all') {
          const messageDate = new Date(message.timestamp);
          const now = new Date();
          const daysDiff = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
          
          switch (filters.dateRange) {
            case 'today':
              if (daysDiff > 0) matches = false;
              break;
            case 'week':
              if (daysDiff > 7) matches = false;
              break;
            case 'month':
              if (daysDiff > 30) matches = false;
              break;
          }
        }

        // Code filter
        if (filters.hasCode) {
          const hasCodeBlock = message.content.includes('```') || 
                              message.content.includes('`') ||
                              /\b(function|const|let|var|class|import|export)\b/.test(message.content);
          if (!hasCodeBlock) matches = false;
          else matchScore += 3;
        }

        // Links filter
        if (filters.hasLinks) {
          const hasLink = /https?:\/\/[^\s]+/.test(message.content);
          if (!hasLink) matches = false;
          else matchScore += 2;
        }

        // Feedback filter
        if (filters.feedback !== 'all') {
          if (filters.feedback === 'none' && message.feedback) {
            matches = false;
          } else if (filters.feedback !== 'none' && message.feedback !== filters.feedback) {
            matches = false;
          }
        }

        if (matches) {
          results.push({ conversation, message, matchScore });
        }
      });
    });

    // Sort by match score and recency
    return results.sort((a, b) => {
      if (a.matchScore !== b.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return new Date(b.message.timestamp).getTime() - new Date(a.message.timestamp).getTime();
    });
  }, [conversations, filters]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      role: 'all',
      dateRange: 'all',
      hasCode: false,
      hasLinks: false,
      feedback: 'all',
    });
  };

  const highlightQuery = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Advanced Search
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search messages..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>
            
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {searchResults.length} results
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Role Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Message Type
                  </label>
                  <select
                    value={filters.role}
                    onChange={(e) => handleFilterChange('role', e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"
                  >
                    <option value="all">All Messages</option>
                    <option value="user">My Messages</option>
                    <option value="assistant">AI Responses</option>
                  </select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                {/* Feedback Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Feedback
                  </label>
                  <select
                    value={filters.feedback}
                    onChange={(e) => handleFilterChange('feedback', e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"
                  >
                    <option value="all">All Feedback</option>
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="none">No Feedback</option>
                  </select>
                </div>
              </div>

              {/* Content Type Filters */}
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.hasCode}
                    onChange={(e) => handleFilterChange('hasCode', e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Contains Code</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.hasLinks}
                    onChange={(e) => handleFilterChange('hasLinks', e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Contains Links</span>
                </label>
              </div>

              <button
                onClick={clearFilters}
                className="px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {searchResults.length === 0 ? (
            <div className="text-center py-8">
              <Search className="w-12 h-12 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
              <p className="text-slate-500 dark:text-slate-400">
                {filters.query.trim() || filters.role !== 'all' || filters.dateRange !== 'all' || filters.hasCode || filters.hasLinks || filters.feedback !== 'all'
                  ? 'No messages found matching your criteria'
                  : 'Enter a search query or apply filters to find messages'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map(({ conversation, message, matchScore }) => (
                <div
                  key={`${conversation.id}-${message.id}`}
                  onClick={() => onMessageSelect(conversation.id, message.id)}
                  className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Bot className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      )}
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {message.role === 'user' ? 'You' : 'AI'}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        in {conversation.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {message.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div
                    className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: highlightQuery(message.content, filters.query)
                    }}
                  />
                  {message.feedback && (
                    <div className="mt-2 flex items-center space-x-1">
                      <Hash className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                      <span className={`text-xs ${
                        message.feedback === 'positive' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {message.feedback} feedback
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
