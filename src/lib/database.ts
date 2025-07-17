import { supabase } from './supabase';
import type { 
  User, 
  Business, 
  ChatbotConfiguration, 
  ChatSession, 
  ChatMessage, 
  Analytics,
  KnowledgeBase,
  ApiUsage,
  Subscription 
} from './supabase';

// =============================================
// USER OPERATIONS
// =============================================

export const createUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUser = async (id: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteUser = async (id: string) => {
  // First delete from the users table (this will cascade to related tables)
  const { error: userError } = await supabase
    .from('users')
    .delete()
    .eq('id', id);
  
  if (userError) throw userError;
  
  // Then delete from auth.users
  const { error: authError } = await supabase.auth.admin.deleteUser(id);
  
  if (authError) throw authError;
};

// =============================================
// BUSINESS OPERATIONS
// =============================================

export const createBusiness = async (businessData: Omit<Business, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('businesses')
    .insert([businessData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getBusinessesByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getBusinessById = async (id: string) => {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateBusiness = async (id: string, updates: Partial<Business>) => {
  const { data, error } = await supabase
    .from('businesses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteBusiness = async (id: string) => {
  const { error } = await supabase
    .from('businesses')
    .update({ is_active: false })
    .eq('id', id);
  
  if (error) throw error;
};

// =============================================
// CHATBOT CONFIGURATION OPERATIONS
// =============================================

export const createChatbotConfiguration = async (
  configData: Omit<ChatbotConfiguration, 'id' | 'created_at' | 'updated_at'>
) => {
  const { data, error } = await supabase
    .from('chatbot_configurations')
    .insert([configData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getChatbotConfigurationByBusinessId = async (businessId: string) => {
  const { data, error } = await supabase
    .from('chatbot_configurations')
    .select('*')
    .eq('business_id', businessId)
    .eq('is_active', true)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateChatbotConfiguration = async (
  id: string, 
  updates: Partial<ChatbotConfiguration>
) => {
  const { data, error } = await supabase
    .from('chatbot_configurations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteChatbotConfiguration = async (id: string) => {
  const { error } = await supabase
    .from('chatbot_configurations')
    .update({ is_active: false })
    .eq('id', id);
  
  if (error) throw error;
};

// =============================================
// CHAT SESSION OPERATIONS
// =============================================

export const createChatSession = async (
  sessionData: Omit<ChatSession, 'id' | 'created_at' | 'updated_at'>
) => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert([sessionData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getChatSessionById = async (id: string) => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateChatSession = async (id: string, updates: Partial<ChatSession>) => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getChatSessionsByBusinessId = async (businessId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
};

// =============================================
// CHAT MESSAGE OPERATIONS
// =============================================

export const createChatMessage = async (
  messageData: Omit<ChatMessage, 'id' | 'created_at'>
) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([messageData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getChatMessagesBySessionId = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
};

// =============================================
// ANALYTICS OPERATIONS
// =============================================

export const createOrUpdateAnalytics = async (
  analyticsData: Omit<Analytics, 'id' | 'created_at'>
) => {
  const { data, error } = await supabase
    .from('analytics')
    .upsert([analyticsData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getAnalyticsByBusinessId = async (
  businessId: string,
  startDate: string,
  endDate: string
) => {
  const { data, error } = await supabase
    .from('analytics')
    .select('*')
    .eq('business_id', businessId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const getBusinessAnalytics = async (
  businessId: string,
  startDate: string,
  endDate: string
) => {
  const { data, error } = await supabase
    .rpc('get_business_analytics', {
      business_uuid: businessId,
      start_date: startDate,
      end_date: endDate
    });
  
  if (error) throw error;
  return data;
};

// =============================================
// KNOWLEDGE BASE OPERATIONS
// =============================================

export const createKnowledgeBase = async (
  kbData: Omit<KnowledgeBase, 'id' | 'created_at' | 'updated_at'>
) => {
  const { data, error } = await supabase
    .from('knowledge_base')
    .insert([kbData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getKnowledgeBaseByBusinessId = async (businessId: string) => {
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .eq('business_id', businessId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const updateKnowledgeBase = async (
  id: string, 
  updates: Partial<KnowledgeBase>
) => {
  const { data, error } = await supabase
    .from('knowledge_base')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteKnowledgeBase = async (id: string) => {
  const { error } = await supabase
    .from('knowledge_base')
    .update({ is_active: false })
    .eq('id', id);
  
  if (error) throw error;
};

// =============================================
// API USAGE OPERATIONS
// =============================================

export const createApiUsage = async (
  usageData: Omit<ApiUsage, 'id' | 'created_at'>
) => {
  const { data, error } = await supabase
    .from('api_usage')
    .insert([usageData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getApiUsageByBusinessId = async (
  businessId: string,
  startDate: string,
  endDate: string
) => {
  const { data, error } = await supabase
    .from('api_usage')
    .select('*')
    .eq('business_id', businessId)
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// =============================================
// SUBSCRIPTION OPERATIONS
// =============================================

export const createSubscription = async (
  subscriptionData: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>
) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([subscriptionData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getSubscriptionByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();
  
  if (error) throw error;
  return data;
};

export const updateSubscription = async (
  id: string, 
  updates: Partial<Subscription>
) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// =============================================
// UTILITY FUNCTIONS
// =============================================

export const resetMonthlyMessages = async () => {
  const { error } = await supabase
    .rpc('reset_monthly_messages');
  
  if (error) throw error;
};

// Get chat statistics for a business
export const getChatStatistics = async (businessId: string, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data: sessions, error: sessionsError } = await supabase
    .from('chat_sessions')
    .select('id, total_messages, session_start, session_end')
    .eq('business_id', businessId)
    .gte('created_at', startDate.toISOString());
  
  if (sessionsError) throw sessionsError;
  
  const { data: messages, error: messagesError } = await supabase
    .from('chat_messages')
    .select('id, created_at, role')
    .in('session_id', sessions.map(s => s.id));
  
  if (messagesError) throw messagesError;
  
  return {
    totalSessions: sessions.length,
    totalMessages: messages.length,
    userMessages: messages.filter(m => m.role === 'user').length,
    assistantMessages: messages.filter(m => m.role === 'assistant').length,
    avgMessagesPerSession: sessions.length > 0 ? messages.length / sessions.length : 0,
    sessions,
    messages
  };
};
