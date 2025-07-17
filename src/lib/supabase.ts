import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Database Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  subscription_tier: 'free' | 'basic' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing';
  subscription_ends_at?: string;
  total_messages: number;
  monthly_messages: number;
  last_message_reset: string;
}

export interface Business {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
  industry?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface ChatbotConfiguration {
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
  custom_css?: string;
  max_message_length: number;
  rate_limit_per_hour: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  business_id: string;
  visitor_id: string;
  session_start: string;
  session_end?: string;
  user_agent?: string;
  ip_address?: string;
  referrer?: string;
  total_messages: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: any;
  tokens_used?: number;
  processing_time?: number;
  created_at: string;
}

export interface Analytics {
  id: string;
  business_id: string;
  date: string;
  total_sessions: number;
  total_messages: number;
  avg_session_duration: number;
  unique_visitors: number;
  top_questions: string[];
  user_satisfaction?: number;
  created_at: string;
}

export interface KnowledgeBase {
  id: string;
  business_id: string;
  title: string;
  content: string;
  file_url?: string;
  file_type?: string;
  embeddings?: number[];
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiUsage {
  id: string;
  business_id: string;
  endpoint: string;
  method: string;
  tokens_used: number;
  cost: number;
  response_time: number;
  status_code: number;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  price_id?: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface WebhookLogs {
  id: string;
  business_id: string;
  webhook_type: string;
  payload: any;
  status: 'success' | 'failed' | 'pending';
  response?: any;
  error_message?: string;
  retry_count: number;
  created_at: string;
}
