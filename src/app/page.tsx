'use client';

import Link from 'next/link';
import { Bot, MessageCircle, Settings, Zap, Shield, Users, ArrowRight, CheckCircle, PlayCircle, Star, TrendingUp, Globe, Sparkles, User } from 'lucide-react';
import { useState } from 'react';
import { FadeIn, SlideIn, ScaleIn, StaggerList, AnimatedCounter, PulseButton, AnimatedIcon } from '../components/Animations';

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant AI responses in under 2 seconds",
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    },
    {
      icon: Settings,
      title: "Easy Setup",
      description: "One-click integration with any website",
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Never miss a customer inquiry again",
      color: "from-purple-400 to-violet-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      icon: TrendingUp,
      title: "Boost Conversions",
      description: "Increase sales by up to 40%",
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      icon: Globe,
      title: "Multi-Language",
      description: "Support customers worldwide",
      color: "from-indigo-400 to-purple-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600"
    },
    {
      icon: Sparkles,
      title: "Smart AI",
      description: "Powered by advanced GPT technology",
      color: "from-pink-400 to-rose-500",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600"
    }
  ];

  const stats = [
    { number: "70%", label: "Reduction in support tickets" },
    { number: "2s", label: "Average response time" },
    { number: "24/7", label: "Always available" },
    { number: "95%", label: "Customer satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">AI Chatbot Business</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <Link href="/widget" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Live Demo
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Pricing
            </Link>
            <Link href="/docs" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Docs
            </Link>
            <Link href="/auth" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Sign In
            </Link>
            <Link href="/auth" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center">
          <FadeIn delay={200}>
            <div className="inline-flex items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <AnimatedIcon icon={Sparkles} className="w-4 h-4 mr-2" animation="pulse" />
              Trusted by 10,000+ businesses worldwide
            </div>
          </FadeIn>
          
          <FadeIn delay={400}>
            <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up">
              Transform Your Website with
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-pulse-slow"> AI-Powered</span> Customer Support
            </h2>
          </FadeIn>
          
          <FadeIn delay={600}>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Boost conversions by 40% and reduce support costs by 70% with our intelligent AI chatbot that never sleeps.
            </p>
          </FadeIn>
          
          <FadeIn delay={800}>
            <div className="flex justify-center space-x-4 mb-12">
              <PulseButton className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold">
                <Link href="/widget" className="flex items-center">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Watch Demo
                </Link>
              </PulseButton>
              <Link href="/auth" className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center animate-scale-in">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </FadeIn>
          
          {/* Stats */}
          <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto" staggerDelay={150}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.number.includes('%') ? (
                    <><AnimatedCounter value={parseInt(stat.number)} /><span>%</span></>
                  ) : (
                    stat.number
                  )}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </StaggerList>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                Powerful Features for Modern Businesses
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to provide exceptional customer support and boost your business growth.
              </p>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <ScaleIn key={index} delay={index * 100}>
                  <div 
                    className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 animate-fade-in ${
                      hoveredFeature === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onMouseEnter={() => setHoveredFeature(index)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 animate-float`}>
                      <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </ScaleIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers say about their experience with our AI chatbot.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Our customer support tickets reduced by 75% after implementing this chatbot. The AI responses are incredibly accurate and helpful."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Sarah Chen</h4>
                  <p className="text-gray-600 text-sm">CEO, TechStart Inc.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "The setup was incredibly easy and the customization options are amazing. Our conversion rate increased by 35% in just 2 months."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Michael Rodriguez</h4>
                  <p className="text-gray-600 text-sm">Marketing Director, GrowthCo</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Customer satisfaction scores went from 3.2 to 4.8 after deployment. The AI understands context incredibly well."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Emily Johnson</h4>
                  <p className="text-gray-600 text-sm">Support Manager, RetailPlus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Why 10,000+ Businesses Choose Us
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Increase Sales by 40%</h4>
                    <p className="text-gray-600">Guide customers through their journey with intelligent recommendations and instant support.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Reduce Support Costs by 70%</h4>
                    <p className="text-gray-600">Automate repetitive inquiries and free up your team for complex issues.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">24/7 Customer Support</h4>
                    <p className="text-gray-600">Never miss a customer inquiry, even when your team is offline.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:pl-12">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Live Demo</h4>
                  <p className="text-gray-600 mb-4">Experience the power of our AI chatbot</p>
                  <Link 
                    href="/widget" 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center"
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Try Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Boost Your Customer Engagement?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses already using our AI chatbot to improve customer satisfaction and reduce support costs.
          </p>
          <Link href="/widget" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            See Live Demo
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">AI Chatbot Business</span>
          </div>
          <p className="text-gray-400">
            Empowering businesses with intelligent customer support solutions.
          </p>
        </div>
      </footer>
    </div>
  );
}
