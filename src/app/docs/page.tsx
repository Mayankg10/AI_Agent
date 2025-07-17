'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Bot, 
  Book, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Code, 
  Settings, 
  MessageCircle, 
  Zap, 
  Globe, 
  Shield, 
  Users, 
  BarChart3,
  ExternalLink,
  Copy,
  Check,
  Play,
  Download,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Target,
  Wrench,
  Sparkles
} from 'lucide-react';

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');
  const [expandedItems, setExpandedItems] = useState<string[]>(['getting-started']);
  const [copiedCode, setCopiedCode] = useState('');

  const toggleExpanded = (item: string) => {
    setExpandedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const copyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const docSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Play,
      items: [
        { id: 'quick-start', title: 'Quick Start Guide' },
        { id: 'account-setup', title: 'Account Setup' },
        { id: 'first-chatbot', title: 'Creating Your First Chatbot' }
      ]
    },
    {
      id: 'integration',
      title: 'Integration',
      icon: Code,
      items: [
        { id: 'html-integration', title: 'HTML/JavaScript Integration' },
        { id: 'react-integration', title: 'React Integration' },
        { id: 'wordpress-integration', title: 'WordPress Integration' },
        { id: 'shopify-integration', title: 'Shopify Integration' }
      ]
    },
    {
      id: 'customization',
      title: 'Customization',
      icon: Settings,
      items: [
        { id: 'appearance', title: 'Appearance & Styling' },
        { id: 'behavior', title: 'Behavior Configuration' },
        { id: 'responses', title: 'Custom Responses' },
        { id: 'multilingual', title: 'Multi-language Support' }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics & Reporting',
      icon: BarChart3,
      items: [
        { id: 'dashboard', title: 'Dashboard Overview' },
        { id: 'metrics', title: 'Key Metrics' },
        { id: 'reports', title: 'Custom Reports' },
        { id: 'export', title: 'Data Export' }
      ]
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: Globe,
      items: [
        { id: 'authentication', title: 'Authentication' },
        { id: 'endpoints', title: 'API Endpoints' },
        { id: 'webhooks', title: 'Webhooks' },
        { id: 'rate-limits', title: 'Rate Limits' }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: Wrench,
      items: [
        { id: 'common-issues', title: 'Common Issues' },
        { id: 'debugging', title: 'Debugging Guide' },
        { id: 'performance', title: 'Performance Optimization' },
        { id: 'support', title: 'Contact Support' }
      ]
    }
  ];

  const quickStartSteps = [
    {
      step: 1,
      title: 'Create Your Account',
      description: 'Sign up for a free account and verify your email address.',
      action: 'Get Started',
      link: '/auth'
    },
    {
      step: 2,
      title: 'Set Up Your Business',
      description: 'Add your business information and configure basic settings.',
      action: 'Dashboard',
      link: '/dashboard'
    },
    {
      step: 3,
      title: 'Customize Your Chatbot',
      description: 'Configure appearance, behavior, and responses.',
      action: 'Try Demo',
      link: '/widget'
    },
    {
      step: 4,
      title: 'Integrate with Your Site',
      description: 'Add the chatbot to your website with our simple embed code.',
      action: 'View Code',
      link: '#html-integration'
    }
  ];

  const integrationCode = `<script>
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://your-domain.com/embed.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'chatbot-widget'));
  
  // Initialize with your config
  window.ChatbotWidget.init({
    businessId: 'your-business-id',
    businessName: 'Your Business Name',
    primaryColor: '#3b82f6',
    accentColor: '#10b981',
    welcomeMessage: 'Hi! How can I help you today?',
    placeholder: 'Type your message...',
    position: 'bottom-right',
    theme: 'auto',
    size: 'medium'
  });
</script>`;

  const reactCode = `import { EmbeddableWidget } from '@your-org/chatbot-widget';

function App() {
  const config = {
    businessId: 'your-business-id',
    businessName: 'Your Business Name',
    primaryColor: '#3b82f6',
    accentColor: '#10b981',
    welcomeMessage: 'Hi! How can I help you today?',
    placeholder: 'Type your message...',
    position: 'bottom-right',
    theme: 'auto',
    size: 'medium',
    apiEndpoint: '/api/chat'
  };

  return (
    <div>
      {/* Your app content */}
      <EmbeddableWidget 
        config={config}
        onMessage={(message) => console.log('Message:', message)}
        onOpen={() => console.log('Widget opened')}
        onClose={() => console.log('Widget closed')}
      />
    </div>
  );
}`;

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Getting Started</h2>
              <p className="text-lg text-gray-600 mb-8">
                Welcome to AI Chatbot Business! This guide will help you get up and running with your first chatbot in just a few minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickStartSteps.map((step, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <Link 
                    href={step.link}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {step.action}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Pro Tips
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Test your chatbot on different devices and browsers before going live
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Customize the welcome message to match your brand voice
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Monitor analytics regularly to optimize performance
                </li>
              </ul>
            </div>
          </div>
        );

      case 'html-integration':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">HTML/JavaScript Integration</h2>
              <p className="text-lg text-gray-600 mb-8">
                Add our chatbot to any website with a simple script tag. No complex setup required.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Integration</h3>
                <button
                  onClick={() => copyCode(integrationCode, 'html-basic')}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  {copiedCode === 'html-basic' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode === 'html-basic' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <pre>{integrationCode}</pre>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Configuration Options
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">businessId</code> - Your unique business identifier</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">primaryColor</code> - Main theme color</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">position</code> - Widget position (bottom-right/bottom-left)</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">theme</code> - Color theme (light/dark/auto)</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">size</code> - Widget size (small/medium/large)</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                  Advanced Features
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Custom CSS styling</li>
                  <li>• Event callbacks</li>
                  <li>• Dynamic configuration</li>
                  <li>• Multiple language support</li>
                  <li>• Custom API endpoints</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'react-integration':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">React Integration</h2>
              <p className="text-lg text-gray-600 mb-8">
                Integrate our chatbot seamlessly into your React application with our dedicated component.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">React Component</h3>
                <button
                  onClick={() => copyCode(reactCode, 'react-basic')}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  {copiedCode === 'react-basic' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode === 'react-basic' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <pre>{reactCode}</pre>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Installation
              </h3>
              <div className="bg-green-900 text-green-100 p-4 rounded-lg text-sm font-mono mb-4">
                <pre>npm install @your-org/chatbot-widget</pre>
              </div>
              <p className="text-green-800">
                Install the package and start using the component in your React application immediately.
              </p>
            </div>
          </div>
        );

      case 'common-issues':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Common Issues</h2>
              <p className="text-lg text-gray-600 mb-8">
                Solutions to the most frequently encountered problems.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "Chatbot widget doesn't appear on my website",
                  answer: "Check that the script is loaded correctly and your businessId is valid. Ensure there are no JavaScript errors in the console."
                },
                {
                  question: "Messages are not being sent",
                  answer: "Verify your API endpoint is correct and accessible. Check network requests in browser developer tools."
                },
                {
                  question: "Widget appears but styling is broken",
                  answer: "This usually indicates CSS conflicts. Try adding our CSS with higher specificity or use the custom CSS option."
                },
                {
                  question: "Slow response times",
                  answer: "Check your network connection and API server status. Consider implementing caching for frequently asked questions."
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
                    {item.question}
                  </h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Book className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Documentation Section</h2>
            <p className="text-gray-600">Select a section from the sidebar to view detailed documentation.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Chatbot Business</h1>
                <p className="text-sm text-gray-600">Documentation</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>
            <Link 
              href="/dashboard"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Documentation</h3>
              <nav className="space-y-2">
                {docSections.map((section) => {
                  const Icon = section.icon;
                  const isExpanded = expandedItems.includes(section.id);
                  
                  return (
                    <div key={section.id}>
                      <button
                        onClick={() => toggleExpanded(section.id)}
                        className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-700">{section.title}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="ml-7 mt-2 space-y-1">
                          {section.items.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => setActiveSection(item.id)}
                              className={`w-full text-left p-2 rounded-lg transition-colors ${
                                activeSection === item.id
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {item.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
