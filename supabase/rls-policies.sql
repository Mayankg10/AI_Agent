-- Row Level Security Policies for AI Chatbot Database
-- These policies ensure users can only access their own data

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USERS TABLE POLICIES
-- =============================================
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
-- BUSINESSES TABLE POLICIES
-- =============================================
CREATE POLICY "Users can view own businesses" ON businesses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own businesses" ON businesses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own businesses" ON businesses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own businesses" ON businesses
    FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- CHATBOT CONFIGURATIONS TABLE POLICIES
-- =============================================
CREATE POLICY "Users can view own chatbot configs" ON chatbot_configurations
    FOR SELECT USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own chatbot configs" ON chatbot_configurations
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

-- =============================================
-- CHAT SESSIONS TABLE POLICIES
-- =============================================
CREATE POLICY "Users can view own chat sessions" ON chat_sessions
    FOR SELECT USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service can insert chat sessions" ON chat_sessions
    FOR INSERT WITH CHECK (true); -- Allow service role to insert

CREATE POLICY "Service can update chat sessions" ON chat_sessions
    FOR UPDATE USING (true); -- Allow service role to update

-- =============================================
-- CHAT MESSAGES TABLE POLICIES
-- =============================================
CREATE POLICY "Users can view own chat messages" ON chat_messages
    FOR SELECT USING (
        session_id IN (
            SELECT cs.id FROM chat_sessions cs
            JOIN businesses b ON cs.business_id = b.id
            WHERE b.user_id = auth.uid()
        )
    );

CREATE POLICY "Service can insert chat messages" ON chat_messages
    FOR INSERT WITH CHECK (true); -- Allow service role to insert

-- =============================================
-- ANALYTICS TABLE POLICIES
-- =============================================
CREATE POLICY "Users can view own analytics" ON analytics
    FOR SELECT USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own analytics" ON analytics
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

-- =============================================
-- KNOWLEDGE BASE TABLE POLICIES
-- =============================================
CREATE POLICY "Users can view own knowledge base" ON knowledge_base
    FOR SELECT USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own knowledge base" ON knowledge_base
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

-- =============================================
-- API USAGE TABLE POLICIES
-- =============================================
CREATE POLICY "Users can view own API usage" ON api_usage
    FOR SELECT USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service can insert API usage" ON api_usage
    FOR INSERT WITH CHECK (true); -- Allow service role to track usage

-- =============================================
-- SUBSCRIPTIONS TABLE POLICIES
-- =============================================
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- WEBHOOK LOGS TABLE POLICIES
-- =============================================
CREATE POLICY "Users can view own webhook logs" ON webhook_logs
    FOR SELECT USING (
        business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service can insert webhook logs" ON webhook_logs
    FOR INSERT WITH CHECK (true); -- Allow service role to log webhooks

-- =============================================
-- PUBLIC ACCESS POLICIES FOR WIDGET
-- =============================================
-- Allow public access to chatbot configurations (for widget)
CREATE POLICY "Public can view active chatbot configs" ON chatbot_configurations
    FOR SELECT USING (is_active = true);

-- Allow public access to create chat sessions (for widget)
CREATE POLICY "Public can create chat sessions" ON chat_sessions
    FOR INSERT WITH CHECK (true);

-- Allow public access to add chat messages (for widget)
CREATE POLICY "Public can add chat messages" ON chat_messages
    FOR INSERT WITH CHECK (true);
