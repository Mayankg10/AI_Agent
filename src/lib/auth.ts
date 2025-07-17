import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'basic' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing';
}

// =============================================
// AUTHENTICATION
// =============================================

export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  
  if (error) throw error;
  return data;
};

export const updatePassword = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
  
  if (error) throw error;
  return data;
};

// =============================================
// USER MANAGEMENT
// =============================================

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Get user profile from our custom users table
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) throw error;
  
  return {
    id: user.id,
    email: user.email!,
    name: profile.name,
    avatar_url: profile.avatar_url,
    subscription_tier: profile.subscription_tier,
    subscription_status: profile.subscription_status,
  };
};

export const updateUserProfile = async (updates: {
  name?: string;
  avatar_url?: string;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// =============================================
// SESSION MANAGEMENT
// =============================================

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
};

// =============================================
// UTILITIES
// =============================================

export const isAuthenticated = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
};

export const requireAuth = async (): Promise<User> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
};

// =============================================
// DEMO USERS (for testing)
// =============================================

export const createDemoUsers = async () => {
  const demoUsers = [
    {
      email: 'demo@example.com',
      password: 'demo123456',
      name: 'Demo User',
    },
    {
      email: 'john@example.com',
      password: 'john123456',
      name: 'John Doe',
    },
    {
      email: 'jane@example.com',
      password: 'jane123456',
      name: 'Jane Smith',
    },
  ];

  const results = [];
  
  for (const user of demoUsers) {
    try {
      const result = await signUp(user.email, user.password, user.name);
      results.push({ ...user, result });
    } catch (error) {
      results.push({ ...user, error });
    }
  }
  
  return results;
};
