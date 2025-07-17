'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Bot, 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Tag, 
  ArrowRight, 
  BookOpen, 
  TrendingUp,
  MessageSquare,
  Sparkles,
  Target,
  Zap,
  Globe,
  Users,
  BarChart3,
  Settings,
  Shield,
  Heart,
  Eye,
  Share2,
  Filter,
  ChevronDown,
  ExternalLink
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  views: number;
  likes: number;
  featured: boolean;
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', name: 'All Posts', count: 12 },
    { id: 'ai-insights', name: 'AI Insights', count: 4 },
    { id: 'business-tips', name: 'Business Tips', count: 3 },
    { id: 'case-studies', name: 'Case Studies', count: 2 },
    { id: 'product-updates', name: 'Product Updates', count: 2 },
    { id: 'tutorials', name: 'Tutorials', count: 1 }
  ];

  const allTags = [
    'AI', 'Chatbots', 'Customer Service', 'Automation', 'Machine Learning',
    'Business Growth', 'Integration', 'Analytics', 'UX', 'Conversion Rate'
  ];

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'The Future of AI-Powered Customer Service: 5 Trends to Watch in 2024',
      excerpt: 'Discover how AI is revolutionizing customer service and what trends will shape the industry in the coming year.',
      content: 'Full article content would go here...',
      author: 'Sarah Johnson',
      date: '2024-01-15',
      readTime: '8 min read',
      category: 'ai-insights',
      tags: ['AI', 'Customer Service', 'Trends'],
      image: '/api/placeholder/600/400',
      views: 2547,
      likes: 156,
      featured: true
    },
    {
      id: '2',
      title: 'How TechCorp Reduced Support Tickets by 75% with AI Chatbots',
      excerpt: 'A detailed case study showing how implementing AI chatbots transformed TechCorp\'s customer support operations.',
      content: 'Full article content would go here...',
      author: 'Michael Chen',
      date: '2024-01-10',
      readTime: '6 min read',
      category: 'case-studies',
      tags: ['Case Study', 'ROI', 'Customer Service'],
      image: '/api/placeholder/600/400',
      views: 1823,
      likes: 89,
      featured: true
    },
    {
      id: '3',
      title: '10 Best Practices for Chatbot UX Design',
      excerpt: 'Learn the essential principles of designing chatbot experiences that users love and engage with.',
      content: 'Full article content would go here...',
      author: 'Emily Rodriguez',
      date: '2024-01-05',
      readTime: '12 min read',
      category: 'tutorials',
      tags: ['UX', 'Design', 'Best Practices'],
      image: '/api/placeholder/600/400',
      views: 3201,
      likes: 234,
      featured: false
    },
    {
      id: '4',
      title: 'Measuring Chatbot Success: Key Metrics Every Business Should Track',
      excerpt: 'Understanding which metrics matter most for measuring your chatbot\'s performance and business impact.',
      content: 'Full article content would go here...',
      author: 'David Kim',
      date: '2024-01-02',
      readTime: '9 min read',
      category: 'business-tips',
      tags: ['Analytics', 'Metrics', 'ROI'],
      image: '/api/placeholder/600/400',
      views: 1456,
      likes: 78,
      featured: false
    },
    {
      id: '5',
      title: 'New Feature Alert: Multi-language Support Now Available',
      excerpt: 'Expand your global reach with our latest multi-language chatbot capabilities.',
      content: 'Full article content would go here...',
      author: 'Lisa Wang',
      date: '2023-12-28',
      readTime: '4 min read',
      category: 'product-updates',
      tags: ['Product Update', 'Multi-language', 'Global'],
      image: '/api/placeholder/600/400',
      views: 987,
      likes: 45,
      featured: false
    },
    {
      id: '6',
      title: 'AI Ethics in Customer Service: Building Trust Through Transparency',
      excerpt: 'Exploring the ethical considerations and best practices for implementing AI in customer service.',
      content: 'Full article content would go here...',
      author: 'Dr. Amanda Foster',
      date: '2023-12-20',
      readTime: '11 min read',
      category: 'ai-insights',
      tags: ['AI Ethics', 'Trust', 'Transparency'],
      image: '/api/placeholder/600/400',
      views: 2103,
      likes: 167,
      featured: false
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const BlogCard = ({ post, featured = false }: { post: BlogPost; featured?: boolean }) => (
    <article className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${featured ? 'border-2 border-blue-200' : ''}`}>
      <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {categories.find(c => c.id === post.category)?.name}
          </span>
          {featured && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <Sparkles className="w-3 h-3 mr-1" />
              Featured
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
          <Link href={`/blog/${post.id}`}>
            {post.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors"
              onClick={() => setSelectedTag(tag)}
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {post.author}
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {post.readTime}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {post.views.toLocaleString()}
            </span>
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {post.likes}
            </span>
          </div>
          <Link
            href={`/blog/${post.id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            Read More
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </article>
  );

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
                <p className="text-sm text-gray-600">Blog & Insights</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/widget" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Demo
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Docs
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Pricing
              </Link>
            </nav>
            <Link 
              href="/auth"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4 mr-2" />
            Latest Insights & Updates
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            AI Chatbot <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Blog</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest trends, insights, and best practices in AI-powered customer service.
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-yellow-500" />
              Featured Posts
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} featured={true} />
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {category.name} ({category.count})
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedTag === tag
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedTag('');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* Newsletter Signup */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Stay Updated with AI Insights
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Get the latest articles, case studies, and industry insights delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
