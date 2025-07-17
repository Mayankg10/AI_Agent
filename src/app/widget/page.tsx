'use client';

import { useState, useEffect } from 'react';
import EmbeddableWidget from '../../components/EmbeddableWidget';
import { Bot, Code, Copy, Check, Settings, Palette, MessageCircle, Sparkles, Zap, Globe, Shield, Monitor, Smartphone, Tablet, RefreshCw, Download, Play, Eye, EyeOff, Home, CreditCard, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function WidgetDemo() {
  const [config, setConfig] = useState({
    businessId: 'demo-business',
    businessName: 'Demo Business',
    primaryColor: '#3b82f6',
    accentColor: '#10b981',
    welcomeMessage: 'Welcome to our demo! How can I help you today?',
    placeholder: 'Ask me anything...',
    position: 'bottom-right' as const,
    theme: 'auto' as const,
    size: 'medium' as const,
    logo: '',
    apiEndpoint: '/api/chat'
  });

  const [activeTab, setActiveTab] = useState<'config' | 'preview' | 'code'>('config');
  const [copied, setCopied] = useState(false);
  const [demoDevice, setDemoDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showWidget, setShowWidget] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const [isLive, setIsLive] = useState(false);

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const presetConfigs = [
    {
      name: 'Modern Blue',
      config: {
        businessName: 'TechCorp',
        primaryColor: '#3b82f6',
        accentColor: '#10b981',
        welcomeMessage: 'Hi there! I\'m your AI assistant. How can I help you today?',
        placeholder: 'Type your message here...'
      }
    },
    {
      name: 'Elegant Purple',
      config: {
        businessName: 'Creative Studio',
        primaryColor: '#8b5cf6',
        accentColor: '#f59e0b',
        welcomeMessage: 'Welcome to our creative space! What can I help you with?',
        placeholder: 'Ask me anything...'
      }
    },
    {
      name: 'Professional Green',
      config: {
        businessName: 'EcoSolutions',
        primaryColor: '#059669',
        accentColor: '#3b82f6',
        welcomeMessage: 'Hello! I\'m here to help with all your eco-friendly needs.',
        placeholder: 'How can I assist you?'
      }
    },
    {
      name: 'Warm Orange',
      config: {
        businessName: 'Cozy Café',
        primaryColor: '#ea580c',
        accentColor: '#dc2626',
        welcomeMessage: 'Welcome to our cozy café! What would you like to know?',
        placeholder: 'Ask about our menu...'
      }
    }
  ];

  const deviceSizes = {
    desktop: { width: '100%', height: '600px' },
    tablet: { width: '768px', height: '500px' },
    mobile: { width: '375px', height: '400px' }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateEmbedCode = () => {
    return `<script>
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://your-domain.com/embed.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'chatbot-widget'));
  
  // Initialize with your config
  window.ChatbotWidget.init({
    businessId: '${config.businessId}',
    businessName: '${config.businessName}',
    primaryColor: '${config.primaryColor}',
    accentColor: '${config.accentColor}',
    welcomeMessage: '${config.welcomeMessage}',
    placeholder: '${config.placeholder}',
    position: '${config.position}',
    theme: '${config.theme}',
    size: '${config.size}'
  });
</script>`;
  };

  const generateReactCode = () => {
    return `import EmbeddableWidget from './components/EmbeddableWidget';

function App() {
  const config = {
    businessId: '${config.businessId}',
    businessName: '${config.businessName}',
    primaryColor: '${config.primaryColor}',
    accentColor: '${config.accentColor}',
    welcomeMessage: '${config.welcomeMessage}',
    placeholder: '${config.placeholder}',
    position: '${config.position}',
    theme: '${config.theme}',
    size: '${config.size}',
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
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Chatbot Business</h1>
                <p className="text-sm text-gray-600">Widget Demo</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/pricing" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pricing</span>
              </Link>
              <Link 
                href="/auth" 
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                Sign In
              </Link>
              <Link 
                href="/auth" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium"
              >
                Get Started
              </Link>
            </nav>
            
            {/* Demo Status */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-green-300'} transition-colors`}></div>
                <span>Live Demo</span>
              </div>
              <div className="text-sm text-gray-600">
                Messages: <span className="font-semibold text-blue-600">{messageCount}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Interactive Demo
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Try Our AI Chatbot Widget
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Customize the appearance, test different configurations, and see how it works on your website.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Quick Presets
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {presetConfigs.map((preset, index) => (
              <button
                key={index}
                onClick={() => setConfig(prev => ({ ...prev, ...preset.config }))}
                className="text-left p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{preset.name}</h4>
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: preset.config.primaryColor }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{preset.config.businessName}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Demo Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Configuration
                </h3>
                <button
                  onClick={() => setShowWidget(!showWidget)}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {showWidget ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>{showWidget ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={config.businessName}
                    onChange={(e) => handleConfigChange('businessName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Accent Color
                    </label>
                    <input
                      type="color"
                      value={config.accentColor}
                      onChange={(e) => handleConfigChange('accentColor', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Welcome Message
                  </label>
                  <textarea
                    value={config.welcomeMessage}
                    onChange={(e) => handleConfigChange('welcomeMessage', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={config.placeholder}
                    onChange={(e) => handleConfigChange('placeholder', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <select
                      value={config.position}
                      onChange={(e) => handleConfigChange('position', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size
                    </label>
                    <select
                      value={config.size}
                      onChange={(e) => handleConfigChange('size', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={config.theme}
                    onChange={(e) => handleConfigChange('theme', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Preview and Code Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'preview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Eye className="w-4 h-4 inline mr-2" />
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'code'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Code className="w-4 h-4 inline mr-2" />
                    Integration Code
                  </button>
                </nav>
              </div>
              
              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'preview' && (
                  <div className="space-y-6">
                    {/* Device Toggle */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
                      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setDemoDevice('desktop')}
                          className={`p-2 rounded-md ${demoDevice === 'desktop' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                        >
                          <Monitor className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDemoDevice('tablet')}
                          className={`p-2 rounded-md ${demoDevice === 'tablet' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                        >
                          <Tablet className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDemoDevice('mobile')}
                          className={`p-2 rounded-md ${demoDevice === 'mobile' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                        >
                          <Smartphone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Device Preview */}
                    <div className="flex justify-center">
                      <div 
                        className="bg-gray-50 rounded-xl p-8 relative overflow-hidden border-2 border-gray-200 transition-all duration-300"
                        style={{
                          width: deviceSizes[demoDevice].width,
                          height: deviceSizes[demoDevice].height,
                          maxWidth: '100%'
                        }}
                      >
                        {/* Mock Website Content */}
                        <div className="h-full flex flex-col items-center justify-center space-y-6">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <Globe className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Your Website</h4>
                            <p className="text-gray-600 text-sm">
                              This is how the chatbot widget will appear on your website
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <div className="flex items-center space-x-2 mb-2">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm font-medium">Fast Response</span>
                              </div>
                              <p className="text-xs text-gray-600">AI responds in under 2 seconds</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <div className="flex items-center space-x-2 mb-2">
                                <Shield className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-medium">Secure</span>
                              </div>
                              <p className="text-xs text-gray-600">End-to-end encryption</p>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-sm text-gray-500 mb-2">Click the chatbot button to try it!</p>
                            <div className="inline-flex items-center space-x-2 text-xs text-blue-600">
                              <MessageCircle className="w-3 h-3" />
                              <span>Widget positioned: {config.position}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'code' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">Integration Code</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyToClipboard(generateEmbedCode())}
                          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          <span>{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                        <button className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">HTML/JavaScript Integration</h4>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                          <pre>{generateEmbedCode()}</pre>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">React Component</h4>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                          <pre>{generateReactCode()}</pre>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2">Integration Features</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Fully customizable appearance and behavior</li>
                        <li>• Responsive design that works on all devices</li>
                        <li>• Real-time AI responses with streaming</li>
                        <li>• Easy one-script integration</li>
                        <li>• No external dependencies required</li>
                        <li>• GDPR compliant and secure</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Lightning Fast</h3>
            <p className="text-gray-600 text-sm">Get instant AI responses in under 2 seconds with our optimized infrastructure.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Easy Setup</h3>
            <p className="text-gray-600 text-sm">One-click integration with any website. No coding experience required.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure & Private</h3>
            <p className="text-gray-600 text-sm">End-to-end encryption and GDPR compliance ensure your data is safe.</p>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Add This to Your Website?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of businesses already using our AI chatbot to improve customer satisfaction and boost conversions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/auth" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <span>Get Started Free</span>
            </Link>
            <Link 
              href="/pricing" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>View Pricing</span>
            </Link>
            <Link 
              href="/" 
              className="text-blue-100 hover:text-white transition-colors flex items-center space-x-2 text-sm"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Embeddable Widget */}
      {showWidget && (
        <EmbeddableWidget
          config={config}
          onMessage={(message) => {
            console.log('Message:', message);
            setMessageCount(prev => prev + 1);
          }}
          onOpen={() => console.log('Widget opened')}
          onClose={() => console.log('Widget closed')}
        />
      )}
    </div>
  );
}
