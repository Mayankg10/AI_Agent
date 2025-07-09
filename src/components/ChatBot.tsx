'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Trash2, Copy, Check, Edit3, RotateCcw, ThumbsUp, ThumbsDown, Download, Save, FolderOpen, MessageSquare, Search, Paperclip, Plus, X } from 'lucide-react';
import SuggestedPrompts from './SuggestedPrompts';
import KeyboardShortcuts from './KeyboardShortcuts';
import TypingIndicator from './TypingIndicator';
import StreamingTypingIndicator from './StreamingTypingIndicator';
import DarkModeToggle from './DarkModeToggle';
import FileUpload from './FileUpload';
import AdvancedSearch from './AdvancedSearch';
import { useStreamingChat } from '../hooks/useStreamingChat';

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

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newMessageId, setNewMessageId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [showConversationList, setShowConversationList] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ file: File; content: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize streaming chat hook
  const { sendMessage: sendStreamingMessage, stopStreaming, isStreaming } = useStreamingChat({
    onMessageStart: (messageId) => {
      setStreamingMessageId(messageId);
      setStreamingContent('');
    },
    onMessageChunk: (messageId, chunk, fullContent) => {
      setStreamingContent(fullContent);
      scrollToBottom();
    },
    onMessageComplete: (messageId, fullContent) => {
      const assistantMessage: Message = {
        id: messageId,
        content: fullContent,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setStreamingContent('');
      setStreamingMessageId(null);
      setNewMessageId(assistantMessage.id);
    },
    onError: (error) => {
      const errorMsg: Message = {
        id: Date.now().toString(),
        content: `❗ Error: ${error}`,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
      setStreamingContent('');
      setStreamingMessageId(null);
      setNewMessageId(errorMsg.id);
    },
  });

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
    // Load conversations from localStorage
    loadConversations();
  }, []);

  // Load conversations from localStorage
  const loadConversations = () => {
    try {
      const saved = localStorage.getItem('ai-chatbot-conversations');
      if (saved) {
        const parsed = JSON.parse(saved);
        setConversations(parsed.map((conv: any) => ({
          ...conv,
          timestamp: new Date(conv.timestamp),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        })));
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  // Save conversations to localStorage
  const saveConversations = (convs: Conversation[]) => {
    try {
      localStorage.setItem('ai-chatbot-conversations', JSON.stringify(convs));
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  };

  // Save current conversation
  const saveCurrentConversation = () => {
    if (messages.length === 0) return;
    
    const title = messages[0]?.content.slice(0, 50) + (messages[0]?.content.length > 50 ? '...' : '') || 'New Conversation';
    const conversation: Conversation = {
      id: currentConversationId || Date.now().toString(),
      title,
      messages,
      timestamp: new Date()
    };

    const updatedConversations = currentConversationId 
      ? conversations.map(conv => conv.id === currentConversationId ? conversation : conv)
      : [...conversations, conversation];
    
    setConversations(updatedConversations);
    setCurrentConversationId(conversation.id);
    saveConversations(updatedConversations);
  };

  // Load a conversation
  const loadConversation = (conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setMessages(conversation.messages);
      setCurrentConversationId(conversationId);
      setShowConversationList(false);
    }
  };

  // Start new conversation
  const startNewConversation = () => {
    if (messages.length > 0) {
      saveCurrentConversation();
    }
    setMessages([]);
    setCurrentConversationId(null);
    setShowConversationList(false);
  };

  // Delete conversation
  const deleteConversation = (conversationId: string) => {
    const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
    setConversations(updatedConversations);
    saveConversations(updatedConversations);
    
    if (currentConversationId === conversationId) {
      setMessages([]);
      setCurrentConversationId(null);
    }
  };

  // Auto-save conversation when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const timeoutId = setTimeout(() => {
        saveCurrentConversation();
      }, 1000); // Auto-save after 1 second of inactivity
      
      return () => clearTimeout(timeoutId);
    }
  }, [messages]);

  // Close conversation list when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showConversationList) {
        const target = event.target as HTMLElement;
        if (!target.closest('.conversation-list-container') && !target.closest('.conversation-list-button')) {
          setShowConversationList(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showConversationList]);

  // Export conversation
  const exportConversation = () => {
    if (messages.length === 0) return;
    
    const content = messages.map(msg => 
      `${msg.role === 'user' ? 'You' : 'AI'} (${msg.timestamp.toLocaleString()}):\n${msg.content}\n\n`
    ).join('');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      // Set minimum height to prevent scrollbar when empty
      const minHeight = 52; // Approximate height for single row with padding
      textareaRef.current.style.height = `${Math.max(scrollHeight, minHeight)}px`;
    }
  };

  // Edit message functionality
  const startEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditingContent(content);
  };

  const cancelEditMessage = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  const saveEditMessage = async () => {
    if (!editingMessageId || !editingContent.trim()) return;

    const messageIndex = messages.findIndex(msg => msg.id === editingMessageId);
    if (messageIndex === -1) return;

    const editedMessage = {
      ...messages[messageIndex],
      content: editingContent.trim(),
      isEdited: true
    };

    // Update the message and remove all messages after it
    const updatedMessages = [...messages.slice(0, messageIndex), editedMessage];
    setMessages(updatedMessages);
    setEditingMessageId(null);
    setEditingContent('');

    // If it's a user message, regenerate AI response
    if (editedMessage.role === 'user') {
      try {
        const messagesToSend = updatedMessages.map(m => ({
          role: m.role,
          content: m.content,
        }));

        await sendStreamingMessage(messagesToSend);
      } catch (error) {
        console.error('Error regenerating response:', error);
      }
    }
  };

  // Regenerate AI response
  const regenerateResponse = async (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1 || messages[messageIndex].role !== 'assistant') return;

    setIsRegenerating(true);
    const messagesUpToRegenerate = messages.slice(0, messageIndex);
    
    // Set messages to state without the old assistant message
    setMessages(messagesUpToRegenerate);
    
    try {
      const messagesToSend = messagesUpToRegenerate.map(m => ({
        role: m.role,
        content: m.content,
      }));

      await sendStreamingMessage(messagesToSend);
    } catch (error) {
      console.error('Error regenerating response:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Feedback functionality
  const giveFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, feedback: msg.feedback === feedback ? null : feedback }
        : msg
    ));
  };

  const handleSend = async () => {
    if ((!inputValue.trim() && !attachedFile) || isLoading || isStreaming) return;

    let messageContent = inputValue;
    
    // Include attached file in the message
    if (attachedFile) {
      const fileInfo = `\n\n📎 File: ${attachedFile.file.name}\n${attachedFile.content}`;
      messageContent = inputValue ? `${inputValue}${fileInfo}` : fileInfo;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      role: 'user',
      timestamp: new Date(),
    };

    setNewMessageId(userMessage.id);
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAttachedFile(null); // Clear attached file
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Use streaming for the response
    const messagesToSend = [...messages, userMessage].map(m => ({
      role: m.role,
      content: m.content,
    }));

    await sendStreamingMessage(messagesToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    if (messages.length > 0) {
      saveCurrentConversation();
    }
    setMessages([]);
    setCurrentConversationId(null);
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

  // File upload handler
  const handleFileUpload = (file: File, content: string) => {
    setAttachedFile({ file, content });
    setShowFileUpload(false);
    
    // Auto-focus the input after file upload
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Remove attached file
  const removeAttachedFile = () => {
    setAttachedFile(null);
  };

  // Advanced search handlers
  const handleSearchMessageSelect = (conversationId: string, messageId: string) => {
    // Load the conversation if it's not the current one
    if (conversationId !== currentConversationId) {
      loadConversation(conversationId);
    }
    
    // Close search modal
    setShowAdvancedSearch(false);
    
    // Scroll to the message (simplified - you could add highlighting)
    setTimeout(() => {
      const messageElement = document.getElementById(`message-${messageId}`);
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a temporary highlight effect
        messageElement.classList.add('highlight-message');
        setTimeout(() => {
          messageElement.classList.remove('highlight-message');
        }, 3000);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 px-4 sm:px-6 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Bot className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">AI Assistant</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block font-medium">Powered by advanced AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DarkModeToggle onToggle={setIsDarkMode} />
            <button
              onClick={() => setShowAdvancedSearch(true)}
              className="p-3 text-slate-400 hover:text-orange-600 hover:bg-orange-50/80 dark:hover:bg-orange-900/20 rounded-xl transition-all duration-200 hover:scale-105"
              title="Advanced search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowConversationList(!showConversationList)}
              className="conversation-list-button p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 hover:scale-105"
              title="View conversations"
            >
              <FolderOpen className="w-5 h-5" />
            </button>
            <button
              onClick={startNewConversation}
              className="p-3 text-slate-400 hover:text-green-600 hover:bg-green-50/80 dark:hover:bg-green-900/20 rounded-xl transition-all duration-200 hover:scale-105"
              title="New conversation"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            {messages.length > 0 && (
              <>
                <button
                  onClick={exportConversation}
                  className="p-3 text-slate-400 hover:text-purple-600 hover:bg-purple-50/80 dark:hover:bg-purple-900/20 rounded-xl transition-all duration-200 hover:scale-105"
                  title="Export conversation"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={clearChat}
                  className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 hover:scale-105"
                  title="Clear chat"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Conversation List Sidebar */}
      {showConversationList && (
        <div className="conversation-list-container absolute top-20 right-4 sm:right-6 w-80 max-w-[calc(100vw-2rem)] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-2xl shadow-slate-500/20 dark:shadow-slate-900/40 z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-slate-200/60 dark:border-slate-700/60">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Conversations</h3>
            <div className="text-sm text-slate-500 dark:text-slate-400">{conversations.length} saved conversations</div>
          </div>
          <div className="overflow-y-auto max-h-80">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div key={conv.id} className="group">
                  <div className="flex items-center justify-between p-3 hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors">
                    <button
                      onClick={() => loadConversation(conv.id)}
                      className="flex-1 text-left"
                    >
                      <div className="font-medium text-slate-800 dark:text-slate-100 text-sm truncate">
                        {conv.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {conv.timestamp.toLocaleDateString()} • {conv.messages.length} messages
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

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
              <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-3">
                Welcome to AI Assistant
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
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
                    : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 mr-4 shadow-slate-500/10 dark:shadow-slate-900/20'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                )}
              </div>
              <div
                className={`rounded-3xl px-6 py-4 shadow-lg backdrop-blur-sm ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-500/25'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50 shadow-slate-500/10 dark:shadow-slate-900/20'
                }`}
              >
                {editingMessageId === message.id ? (
                  <div className="space-y-3">
                    <textarea
                      ref={editTextareaRef}
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full px-3 py-2 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none min-h-[80px] text-sm font-medium text-slate-800 dark:text-slate-200"
                      rows={3}
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={cancelEditMessage}
                        className="px-3 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEditMessage}
                        className="px-3 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-200"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {message.content}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs font-medium ${
                            message.role === 'user' 
                              ? 'text-blue-100' 
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </span>
                        {message.isEdited && (
                          <span className="text-xs text-slate-400 dark:text-slate-500">(edited)</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {message.role === 'user' && (
                          <button
                            onClick={() => startEditMessage(message.id, message.content)}
                            className="p-2 text-blue-200 hover:text-white hover:bg-blue-700/50 rounded-xl transition-all duration-200 hover:scale-105"
                            title="Edit message"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {message.role === 'assistant' && (
                          <>
                            <button
                              onClick={() => regenerateResponse(message.id)}
                              className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-105"
                              title="Regenerate response"
                              disabled={isRegenerating}
                            >
                              <RotateCcw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                              onClick={() => giveFeedback(message.id, 'positive')}
                              className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 ${
                                message.feedback === 'positive'
                                  ? 'text-green-600 bg-green-100/50 dark:bg-green-900/30'
                                  : 'text-slate-400 dark:text-slate-500 hover:text-green-600 hover:bg-green-50/50 dark:hover:bg-green-900/20'
                              }`}
                              title="Good response"
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => giveFeedback(message.id, 'negative')}
                              className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 ${
                                message.feedback === 'negative'
                                  ? 'text-red-600 bg-red-100/50 dark:bg-red-900/30'
                                  : 'text-slate-400 dark:text-slate-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-900/20'
                              }`}
                              title="Poor response"
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => copyMessage(message.content, message.id)}
                              className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-105"
                              title="Copy message"
                            >
                              {copiedId === message.id ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

          {isStreaming && (
            <StreamingTypingIndicator 
              content={streamingContent}
              onStop={stopStreaming}
              canStop={true}
            />
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-700/60 px-4 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Attached File Display */}
          {attachedFile && (
            <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Paperclip className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {attachedFile.file.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ({(attachedFile.file.size / 1024).toFixed(1)}KB)
                  </span>
                </div>
                <button
                  onClick={removeAttachedFile}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
            </div>
          )}

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
                placeholder={attachedFile ? "Add a message (optional)..." : "Ask me anything..."}
                className="w-full px-6 py-4 pr-20 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none min-h-[52px] max-h-32 text-sm font-medium placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-slate-200 shadow-lg shadow-slate-500/5 dark:shadow-slate-900/20 transition-all duration-200"
                rows={1}
                disabled={isLoading || isStreaming}
                style={{ overflow: 'hidden' }}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <button
                  onClick={() => setShowFileUpload(!showFileUpload)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-all duration-200 hover:scale-105"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={(!inputValue.trim() && !attachedFile) || isLoading || isStreaming}
                  className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/25 disabled:hover:scale-100"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* File Upload Panel */}
          {showFileUpload && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Upload File</h3>
                <button
                  onClick={() => setShowFileUpload(false)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
              <FileUpload 
                onFileUpload={handleFileUpload}
                disabled={isLoading || isStreaming}
              />
            </div>
          )}
          <div className="flex items-center justify-center mt-4 space-x-6">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Press <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300 font-mono text-xs">Enter</kbd> to send • 
              <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300 font-mono text-xs">Shift+Enter</kbd> for new line • 
              <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300 font-mono text-xs">Ctrl+K</kbd> to focus
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium sm:hidden">
              Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300 font-mono text-xs">Enter</kbd> to send
            </p>
          </div>
        </div>
      </div>
      
      <KeyboardShortcuts onClearChat={clearChat} onFocusInput={focusInput} />
    </div>
  );
}
