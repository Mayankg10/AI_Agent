-- AI Chatbot Business Solution Database Schema
-- This schema supports multi-tenant chatbot configurations with analytics

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'pro', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');
CREATE TYPE chat_position AS ENUM ('bottom-right', 'bottom-left');
CREATE TYPE chat_theme AS ENUM ('light', 'dark', 'auto');
CREATE TYPE chat_size AS ENUM ('small', 'medium', 'large');
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');
CREATE TYPE webhook_status AS ENUM ('success', 'failed', 'pending');

-- =============================================
-- USERS TABLE (extends auth.users)
-- =============================================
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    subscription_tier subscription_tier DEFAULT 'free',
    subscription_status subscription_status DEFAULT 'active',
    subscription_ends_at TIMESTAMP WITH TIME ZONE,
    total_messages INTEGER DEFAULT 0,
    monthly_messages INTEGER DEFAULT 0,
    last_message_reset TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- BUSINESSES TABLE
-- =============================================
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    website_url TEXT,
    logo_url TEXT,
    industry VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- =============================================
-- CHATBOT CONFIGURATIONS TABLE
-- =============================================
CREATE TABLE chatbot_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    primary_color VARCHAR(7) DEFAULT '#3b82f6',
    accent_color VARCHAR(7) DEFAULT '#10b981',
    welcome_message TEXT DEFAULT 'Hello! How can I help you today?',
    placeholder VARCHAR(255) DEFAULT 'Ask me anything...',
    position chat_position DEFAULT 'bottom-right',
    theme chat_theme DEFAULT 'auto',
    size chat_size DEFAULT 'medium',
    logo_url TEXT,
    custom_css TEXT,
    max_message_length INTEGER DEFAULT 1000,
    rate_limit_per_hour INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- CHAT SESSIONS TABLE
-- =============================================
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    visitor_id VARCHAR(255) NOT NULL, -- Client-generated or IP-based ID
    session_start TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP WITH TIME ZONE,
    user_agent TEXT,
    ip_address INET,
    referrer TEXT,
    total_messages INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- CHAT MESSAGES TABLE
-- =============================================
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role message_role NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    tokens_used INTEGER,
    processing_time INTEGER, -- in milliseconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ANALYTICS TABLE
-- =============================================
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_sessions INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    avg_session_duration DECIMAL(10,2) DEFAULT 0, -- in minutes
    unique_visitors INTEGER DEFAULT 0,
    top_questions TEXT[], -- Array of popular questions
    user_satisfaction DECIMAL(3,2), -- 0-5 rating
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(business_id, date)
);

-- =============================================
-- KNOWLEDGE BASE TABLE
-- =============================================
CREATE TABLE knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    file_url TEXT,
    file_type VARCHAR(50),
    embeddings TEXT, -- JSON string for now, can be converted to vector later
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- API USAGE TABLE
-- =============================================
CREATE TABLE api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    cost DECIMAL(10,4) DEFAULT 0, -- Cost in USD
    response_time INTEGER, -- in milliseconds
    status_code INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- SUBSCRIPTIONS TABLE
-- =============================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    tier subscription_tier DEFAULT 'free',
    status subscription_status DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    price_id VARCHAR(255),
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- WEBHOOK LOGS TABLE
-- =============================================
CREATE TABLE webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    webhook_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    status webhook_status DEFAULT 'pending',
    response JSONB,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- INDEXES
-- =============================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);

-- Businesses indexes
CREATE INDEX idx_businesses_user_id ON businesses(user_id);
CREATE INDEX idx_businesses_is_active ON businesses(is_active);

-- Chatbot configurations indexes
CREATE INDEX idx_chatbot_configurations_business_id ON chatbot_configurations(business_id);
CREATE INDEX idx_chatbot_configurations_is_active ON chatbot_configurations(is_active);

-- Chat sessions indexes
CREATE INDEX idx_chat_sessions_business_id ON chat_sessions(business_id);
CREATE INDEX idx_chat_sessions_visitor_id ON chat_sessions(visitor_id);
CREATE INDEX idx_chat_sessions_session_start ON chat_sessions(session_start);
CREATE INDEX idx_chat_sessions_is_active ON chat_sessions(is_active);

-- Chat messages indexes
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_role ON chat_messages(role);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- Analytics indexes
CREATE INDEX idx_analytics_business_id ON analytics(business_id);
CREATE INDEX idx_analytics_date ON analytics(date);

-- Knowledge base indexes
CREATE INDEX idx_knowledge_base_business_id ON knowledge_base(business_id);
CREATE INDEX idx_knowledge_base_is_active ON knowledge_base(is_active);
CREATE INDEX idx_knowledge_base_tags ON knowledge_base USING GIN(tags);

-- API usage indexes
CREATE INDEX idx_api_usage_business_id ON api_usage(business_id);
CREATE INDEX idx_api_usage_created_at ON api_usage(created_at);
CREATE INDEX idx_api_usage_endpoint ON api_usage(endpoint);

-- Subscriptions indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Webhook logs indexes
CREATE INDEX idx_webhook_logs_business_id ON webhook_logs(business_id);
CREATE INDEX idx_webhook_logs_webhook_type ON webhook_logs(webhook_type);
CREATE INDEX idx_webhook_logs_status ON webhook_logs(status);
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs(created_at);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chatbot_configurations_updated_at BEFORE UPDATE ON chatbot_configurations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON knowledge_base
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to get business analytics
CREATE OR REPLACE FUNCTION get_business_analytics(business_uuid UUID, start_date DATE, end_date DATE)
RETURNS TABLE (
    total_sessions BIGINT,
    total_messages BIGINT,
    avg_session_duration DECIMAL,
    unique_visitors BIGINT,
    daily_stats JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT cs.id)::BIGINT as total_sessions,
        COUNT(cm.id)::BIGINT as total_messages,
        AVG(EXTRACT(EPOCH FROM (cs.session_end - cs.session_start))/60)::DECIMAL as avg_session_duration,
        COUNT(DISTINCT cs.visitor_id)::BIGINT as unique_visitors,
        jsonb_agg(
            jsonb_build_object(
                'date', DATE(cs.created_at),
                'sessions', COUNT(DISTINCT cs.id),
                'messages', COUNT(cm.id)
            )
        ) as daily_stats
    FROM chat_sessions cs
    LEFT JOIN chat_messages cm ON cs.id = cm.session_id
    WHERE cs.business_id = business_uuid
    AND DATE(cs.created_at) BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update message counts
CREATE OR REPLACE FUNCTION update_message_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Update session message count
    UPDATE chat_sessions 
    SET total_messages = total_messages + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.session_id;
    
    -- Update user message count
    UPDATE users 
    SET total_messages = total_messages + 1,
        monthly_messages = monthly_messages + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = (
        SELECT b.user_id 
        FROM businesses b 
        JOIN chat_sessions cs ON b.id = cs.business_id 
        WHERE cs.id = NEW.session_id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update message counts
CREATE TRIGGER update_message_counts_trigger
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_message_counts();

-- Function to reset monthly message counts
CREATE OR REPLACE FUNCTION reset_monthly_messages()
RETURNS void AS $$
BEGIN
    UPDATE users 
    SET monthly_messages = 0,
        last_message_reset = CURRENT_TIMESTAMP
    WHERE last_message_reset < DATE_TRUNC('month', CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO users (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
