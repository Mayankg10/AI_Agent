'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  MessageSquare,
  BarChart3,
  Users,
  Globe,
  Copy,
  Eye,
  RefreshCw,
  TrendingUp,
  Clock,
  Star,
  Bot,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Activity,
  PieChart,
  Calendar,
  ExternalLink,
  Zap,
  Shield,
  Sparkles,
  Building,
  User
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  subscription_tier: string;
  subscription_status: string;
  created_at: string;
}

interface Business {
  id: string;
  name: string;
  description?: string;
  website_url?: string;
  created_at: string;
}

interface ChatbotConfig {
  id: string;
  business_id: string;
  business_name: string;
  primary_color: string;
  accent_color: string;
  welcome_message: string;
  placeholder: string;
  position: 'bottom-right' | 'bottom-left';
  theme: 'light' | 'dark' | 'auto';
  size: 'small' | 'medium' | 'large';
  logo_url?: string;
  is_active: boolean;
}

interface Analytics {
  totalSessions: number;
  totalMessages: number;
  avgResponseTime: number;
  satisfaction: number;
  topQuestions: string[];
  monthlyGrowth: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig | null>(null);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalSessions: 0,
    totalMessages: 0,
    avgResponseTime: 0,
    satisfaction: 0,
    topQuestions: [],
    monthlyGrowth: 0
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'businesses' | 'chatbot' | 'analytics' | 'settings'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [embedCode, setEmbedCode] = useState('');

  // Check authentication and load user data
  useEffect(() => {
    const userSession = localStorage.getItem('userSession');
    if (!userSession) {
      router.push('/auth');
      return;
    }

    const userData = JSON.parse(userSession);
    setUser(userData);
    loadUserData(userData.id);
  }, [router]);

  const loadUserData = async (userId: string) => {
    try {
      setIsLoading(true);
      // Load user's businesses
      const businessesRes = await fetch(`/api/businesses?userId=${userId}`);
      if (businessesRes.ok) {
        const businessData = await businessesRes.json();
        setBusinesses(businessData);
        if (businessData.length > 0) {
          setSelectedBusiness(businessData[0]);
          loadBusinessData(businessData[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBusinessData = async (businessId: string) => {
    try {
      // Load chatbot config
      const configRes = await fetch(`/api/config?businessId=${businessId}`);
      if (configRes.ok) {
        const configData = await configRes.json();
        setChatbotConfig(configData);
        generateEmbedCode(businessId, configData);
      }

      // Load analytics (mock data for now)
      setAnalytics({
        totalSessions: 1250,
        totalMessages: 4580,
        avgResponseTime: 1.8,
        satisfaction: 4.7,
        topQuestions: [
          'What are your business hours?',
          'How can I contact support?',
          'What services do you offer?',
          'How do I place an order?',
          'What is your return policy?'
        ],
        monthlyGrowth: 23.5
      });
    } catch (error) {
      console.error('Error loading business data:', error);
    }
  };

  const generateEmbedCode = (businessId: string, config: any) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';
    const code = `<script>
  (function() {
    const script = document.createElement('script');
    script.src = '${origin}/embed.js';
    script.async = true;
    script.onload = function() {
      window.ChatbotWidget && window.ChatbotWidget.init({
        businessId: '${businessId}',
        businessName: '${config.business_name}',
        primaryColor: '${config.primary_color}',
        accentColor: '${config.accent_color}',
        welcomeMessage: '${config.welcome_message}',
        placeholder: '${config.placeholder}',
        position: '${config.position}',
        theme: '${config.theme}',
        size: '${config.size}',
        logo: '${config.logo_url || ''}',
        apiEndpoint: '${origin}/api/chat'
      });
    };
    document.head.appendChild(script);
  })();
</script>`;
    setEmbedCode(code);
  };

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    router.push('/');
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setMessage('Embed code copied to clipboard!');
    setTimeout(() => setMessage(''), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Chatbot Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user?.subscription_tier}</span> plan
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'businesses', label: 'Businesses', icon: Building },
              { id: 'chatbot', label: 'Chatbot', icon: Bot },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.totalSessions.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+{analytics.monthlyGrowth}%</span>
                  <span className="text-gray-500 ml-2">vs last month</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Messages</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.totalMessages.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+18.2%</span>
                  <span className="text-gray-500 ml-2">vs last month</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Response Time</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.avgResponseTime}s</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">-12%</span>
                  <span className="text-gray-500 ml-2">faster</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Satisfaction</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.satisfaction}/5</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+0.3</span>
                  <span className="text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('chatbot')}
                    className="w-full flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Configure Chatbot</span>
                  </button>
                  <button
                    onClick={() => window.open('/widget', '_blank')}
                    className="w-full flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                    <span>Preview Chatbot</span>
                  </button>
                  <button
                    onClick={() => setShowEmbedCode(!showEmbedCode)}
                    className="w-full flex items-center space-x-3 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                    <span>Get Embed Code</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Questions</h3>
                <div className="space-y-2">
                  {analytics.topQuestions.slice(0, 5).map((question, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{question}</span>
                      <span className="text-xs text-gray-500">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Embed Code Modal */}
            {showEmbedCode && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Embed Code</h3>
                <p className="text-gray-600 mb-4">Copy this code and paste it into your website's HTML:</p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                  <pre>{embedCode}</pre>
                </div>
                <button
                  onClick={copyEmbedCode}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Copy Code
                </button>
              </div>
            )}
          </div>
        )}

        {/* Other tabs content would go here */}
        {activeTab === 'businesses' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Businesses</h3>
            <p className="text-gray-600">Business management features coming soon...</p>
          </div>
        )}

        {activeTab === 'chatbot' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chatbot Configuration</h3>
            <p className="text-gray-600">Chatbot configuration features coming soon...</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h3>
            <p className="text-gray-600">Advanced analytics features coming soon...</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
            <p className="text-gray-600">Settings features coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
