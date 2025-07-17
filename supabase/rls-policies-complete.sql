-- Complete RLS Schema with Policies for All Tables
-- Run this in your Supabase SQL editor

-- First, fix the trigger function with CASCADE
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Create the improved trigger function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger 
SECURITY DEFINER -- This allows bypassing RLS
SET search_path = public, pg_temp
AS $$
DECLARE
    user_name TEXT;
BEGIN
    -- Extract name from metadata or use email prefix
    user_name := COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name', 
        NEW.raw_user_meta_data->>'display_name',
        split_part(NEW.email, '@', 1)
    );

    -- Insert into users table (bypasses RLS due to SECURITY DEFINER)
    INSERT INTO public.users (id, email, name, avatar_url, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        user_name,
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.created_at
    );
    
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        RETURN NEW;
    WHEN others THEN
        RAISE LOG 'Error creating user profile for %: %', NEW.email, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- =============================================
-- RLS POLICIES FOR ALL TABLES
-- =============================================

-- 1. USERS TABLE POLICIES
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users during signup" ON users;

-- Create new policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for system during signup" ON users
    FOR INSERT WITH CHECK (true);

-- 2. BUSINESSES TABLE POLICIES
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can create businesses" ON businesses;
DROP POLICY IF EXISTS "Users can update own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can delete own businesses" ON businesses;

CREATE POLICY "Users can view own businesses" ON businesses
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create businesses" ON businesses
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own businesses" ON businesses
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own businesses" ON businesses
    FOR DELETE USING (user_id = auth.uid());

-- 3. CHATBOT CONFIGURATIONS TABLE POLICIES
ALTER TABLE chatbot_configurations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own chatbot configs" ON chatbot_configurations;
DROP POLICY IF EXISTS "Users can create chatbot configs" ON chatbot_configurations;
DROP POLICY IF EXISTS "Users can update own chatbot configs" ON chatbot_configurations;
DROP POLICY IF EXISTS "Users can delete own chatbot configs" ON chatbot_configurations;

CREATE POLICY "Users can view own chatbot configs" ON chatbot_configurations
    FOR SELECT USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create chatbot configs" ON chatbot_configurations
    FOR INSERT WITH CHECK (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own chatbot configs" ON chatbot_configurations
    FOR UPDATE USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own chatbot configs" ON chatbot_configurations
    FOR DELETE USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

-- 4. CHAT SESSIONS TABLE POLICIES
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Anonymous users can create chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can update own chat sessions" ON chat_sessions;

CREATE POLICY "Users can view own chat sessions" ON chat_sessions
    FOR SELECT USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

-- Allow anonymous users to create chat sessions for public chatbots
CREATE POLICY "Anonymous users can create chat sessions" ON chat_sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own chat sessions" ON chat_sessions
    FOR UPDATE USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

-- 5. CHAT MESSAGES TABLE POLICIES
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Anonymous users can create chat messages" ON chat_messages;

CREATE POLICY "Users can view own chat messages" ON chat_messages
    FOR SELECT USING (
        session_id IN (
            SELECT cs.id FROM chat_sessions cs
            JOIN businesses b ON cs.business_id = b.id
            WHERE b.user_id = auth.uid()
        )
    );

-- Allow anonymous users to create chat messages
CREATE POLICY "Anonymous users can create chat messages" ON chat_messages
    FOR INSERT WITH CHECK (true);

-- 6. ANALYTICS TABLE POLICIES
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own analytics" ON analytics;
DROP POLICY IF EXISTS "Users can create analytics" ON analytics;
DROP POLICY IF EXISTS "Users can update own analytics" ON analytics;

CREATE POLICY "Users can view own analytics" ON analytics
    FOR SELECT USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create analytics" ON analytics
    FOR INSERT WITH CHECK (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own analytics" ON analytics
    FOR UPDATE USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

-- 7. KNOWLEDGE BASE TABLE POLICIES
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own knowledge base" ON knowledge_base;
DROP POLICY IF EXISTS "Users can create knowledge base" ON knowledge_base;
DROP POLICY IF EXISTS "Users can update own knowledge base" ON knowledge_base;
DROP POLICY IF EXISTS "Users can delete own knowledge base" ON knowledge_base;

CREATE POLICY "Users can view own knowledge base" ON knowledge_base
    FOR SELECT USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create knowledge base" ON knowledge_base
    FOR INSERT WITH CHECK (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own knowledge base" ON knowledge_base
    FOR UPDATE USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own knowledge base" ON knowledge_base
    FOR DELETE USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

-- 8. API USAGE TABLE POLICIES
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own api usage" ON api_usage;
DROP POLICY IF EXISTS "System can create api usage" ON api_usage;

CREATE POLICY "Users can view own api usage" ON api_usage
    FOR SELECT USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

-- Allow system to create API usage records
CREATE POLICY "System can create api usage" ON api_usage
    FOR INSERT WITH CHECK (true);

-- 9. SUBSCRIPTIONS TABLE POLICIES
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can create subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;

CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own subscriptions" ON subscriptions
    FOR UPDATE USING (user_id = auth.uid());

-- 10. WEBHOOK LOGS TABLE POLICIES
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own webhook logs" ON webhook_logs;
DROP POLICY IF EXISTS "System can create webhook logs" ON webhook_logs;

CREATE POLICY "Users can view own webhook logs" ON webhook_logs
    FOR SELECT USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

-- Allow system to create webhook logs
CREATE POLICY "System can create webhook logs" ON webhook_logs
    FOR INSERT WITH CHECK (true);

-- =============================================
-- CREATE MISSING USER PROFILES
-- =============================================

-- Create profiles for existing users who don't have them
INSERT INTO public.users (id, email, name, avatar_url, created_at)
SELECT 
    au.id,
    au.email,
    COALESCE(
        au.raw_user_meta_data->>'name',
        au.raw_user_meta_data->>'full_name', 
        au.raw_user_meta_data->>'display_name',
        split_part(au.email, '@', 1)
    ) as name,
    au.raw_user_meta_data->>'avatar_url',
    au.created_at
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check counts
SELECT 
    'auth.users count' as source,
    COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
    'public.users count' as source,
    COUNT(*) as count
FROM public.users
UNION ALL
SELECT 
    'missing profiles' as source,
    COUNT(*) as count
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL;

-- Check if trigger exists
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
