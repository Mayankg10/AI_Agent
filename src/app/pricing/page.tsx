'use client';

import Link from 'next/link';
import { Bot, Check, Star, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: 'per month',
      description: 'Perfect for small businesses getting started',
      features: [
        'Up to 1,000 messages/month',
        '1 chatbot',
        'Basic customization',
        'Email support',
        'Analytics dashboard',
        'Website integration'
      ],
      popular: false,
      buttonText: 'Start Free Trial',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Professional',
      price: '$79',
      period: 'per month',
      description: 'Most popular for growing businesses',
      features: [
        'Up to 10,000 messages/month',
        '5 chatbots',
        'Advanced customization',
        'Priority support',
        'Advanced analytics',
        'API access',
        'Custom integrations',
        'Multi-language support'
      ],
      popular: true,
      buttonText: 'Start Free Trial',
      buttonColor: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: 'per month',
      description: 'For large organizations with custom needs',
      features: [
        'Unlimited messages',
        'Unlimited chatbots',
        'Full customization',
        'Dedicated support',
        'Custom analytics',
        'White-label solution',
        'SSO integration',
        'Custom AI training',
        'SLA guarantee'
      ],
      popular: false,
      buttonText: 'Contact Sales',
      buttonColor: 'bg-gray-800 hover:bg-gray-900'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">AI Chatbot Business</h1>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/widget" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Demo
            </Link>
            <Link href="/auth" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your business. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg p-8 relative ${
                plan.popular 
                  ? 'ring-2 ring-blue-500 transform scale-105' 
                  : 'hover:shadow-xl transition-shadow duration-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth"
                className={`w-full ${plan.buttonColor} text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center`}
              >
                {plan.buttonText}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Can I change plans anytime?
              </h4>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Is there a free trial?
              </h4>
              <p className="text-gray-600">
                All plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                What happens if I exceed my message limit?
              </h4>
              <p className="text-gray-600">
                We'll notify you when you approach your limit. You can upgrade or purchase additional messages.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Do you offer custom solutions?
              </h4>
              <p className="text-gray-600">
                Yes, our Enterprise plan includes custom solutions tailored to your specific needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Customer Support?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses already using our AI chatbot platform.
          </p>
          <Link 
            href="/auth"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center"
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
