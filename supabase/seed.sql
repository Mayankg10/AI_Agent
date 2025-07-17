-- Seed data for AI Chatbot Business Solution
-- This file contains sample data for development and testing

-- Insert sample users
INSERT INTO users (id, email, name, subscription_tier, subscription_status, total_messages, monthly_messages) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'john.doe@example.com', 'John Doe', 'free', 'active', 0, 0),
  ('550e8400-e29b-41d4-a716-446655440001', 'jane.smith@example.com', 'Jane Smith', 'pro', 'active', 150, 25),
  ('550e8400-e29b-41d4-a716-446655440002', 'mike.johnson@example.com', 'Mike Johnson', 'basic', 'active', 75, 12);

-- Insert sample businesses
INSERT INTO businesses (id, user_id, name, description, website_url, industry) VALUES
  ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'TechCorp Solutions', 'Leading technology consulting firm', 'https://techcorp.example.com', 'Technology'),
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Green Energy Co', 'Renewable energy solutions provider', 'https://greenenergy.example.com', 'Energy'),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Fashion Forward', 'Modern fashion e-commerce platform', 'https://fashionforward.example.com', 'Fashion');

-- Insert sample chatbot configurations
INSERT INTO chatbot_configurations (id, business_id, business_name, primary_color, accent_color, welcome_message, placeholder, position, theme, size) VALUES
  ('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 'TechCorp Solutions', '#2563eb', '#10b981', 'Hello! I''m here to help you with your technology needs. How can I assist you today?', 'Ask about our services...', 'bottom-right', 'auto', 'medium'),
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Green Energy Co', '#22c55e', '#3b82f6', 'Welcome to Green Energy Co! How can I help you go green today?', 'Ask about renewable energy...', 'bottom-right', 'light', 'large'),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'Fashion Forward', '#ec4899', '#f59e0b', 'Hi there! Welcome to Fashion Forward. What can I help you find today?', 'Ask about our latest styles...', 'bottom-left', 'dark', 'medium');

-- Insert sample chat sessions
INSERT INTO chat_sessions (id, business_id, visitor_id, session_start, total_messages, is_active) VALUES
  ('880e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 'visitor_001', NOW() - INTERVAL '2 hours', 4, false),
  ('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'visitor_002', NOW() - INTERVAL '1 hour', 6, false),
  ('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'visitor_003', NOW() - INTERVAL '30 minutes', 3, true);

-- Insert sample chat messages
INSERT INTO chat_messages (id, session_id, role, content, tokens_used, processing_time) VALUES
  ('990e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440000', 'user', 'Hello, I need help with cloud migration', 15, NULL),
  ('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440000', 'assistant', 'I''d be happy to help you with cloud migration! We offer comprehensive cloud migration services including AWS, Azure, and Google Cloud. What type of infrastructure are you currently using?', 45, 1200),
  ('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440000', 'user', 'We have on-premise servers with Windows Server 2019', 12, NULL),
  ('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440000', 'assistant', 'Perfect! We specialize in Windows Server migrations. We can help you migrate to Azure Virtual Machines or AWS EC2 instances. Would you like to schedule a consultation to discuss your specific requirements?', 52, 1500),
  
  ('990e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440001', 'user', 'What solar panel options do you have?', 10, NULL),
  ('990e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440001', 'assistant', 'We offer several solar panel options including monocrystalline, polycrystalline, and thin-film panels. Our most popular residential option is our 400W monocrystalline panels with 25-year warranty. What''s your roof size and average monthly electricity usage?', 60, 1800),
  
  ('990e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440002', 'user', 'Do you have any summer dresses?', 8, NULL),
  ('990e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440002', 'assistant', 'Yes! We have a beautiful collection of summer dresses. Our current summer collection includes floral midi dresses, casual sundresses, and elegant maxi dresses. What style and size are you looking for?', 42, 1100);

-- Insert sample analytics data
INSERT INTO analytics (id, business_id, date, total_sessions, total_messages, avg_session_duration, unique_visitors, top_questions) VALUES
  ('aa0e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', CURRENT_DATE - INTERVAL '1 day', 15, 45, 8.5, 12, ARRAY['cloud migration', 'pricing', 'support']),
  ('aa0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '1 day', 8, 28, 12.3, 7, ARRAY['solar panels', 'installation', 'cost']),
  ('aa0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', CURRENT_DATE - INTERVAL '1 day', 22, 66, 6.2, 18, ARRAY['dresses', 'sizes', 'shipping']);

-- Insert sample knowledge base entries
INSERT INTO knowledge_base (id, business_id, title, content, tags) VALUES
  ('bb0e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 'Cloud Migration Guide', 'Our comprehensive cloud migration process includes assessment, planning, execution, and optimization phases. We support AWS, Azure, and Google Cloud Platform migrations.', ARRAY['cloud', 'migration', 'aws', 'azure', 'gcp']),
  ('bb0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Solar Panel Installation Process', 'Our solar panel installation process takes 1-3 days depending on system size. We handle permits, installation, and grid connection. All installations come with 25-year warranty.', ARRAY['solar', 'installation', 'warranty', 'process']),
  ('bb0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'Sizing Guide', 'Our sizing guide helps you find the perfect fit. We offer sizes XS to 3XL with detailed measurements for each size. Free returns within 30 days.', ARRAY['sizing', 'guide', 'returns', 'measurements']);

-- Insert sample subscriptions
INSERT INTO subscriptions (id, user_id, tier, status, current_period_start, current_period_end, quantity) VALUES
  ('cc0e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'free', 'active', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '30 days', 1),
  ('cc0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'pro', 'active', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '15 days', 1),
  ('cc0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'basic', 'active', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', 1);

-- Insert sample API usage data
INSERT INTO api_usage (id, business_id, endpoint, method, tokens_used, cost, response_time, status_code) VALUES
  ('dd0e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', '/api/chat', 'POST', 45, 0.0009, 1200, 200),
  ('dd0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', '/api/chat', 'POST', 52, 0.0010, 1500, 200),
  ('dd0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '/api/chat', 'POST', 60, 0.0012, 1800, 200),
  ('dd0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', '/api/chat', 'POST', 42, 0.0008, 1100, 200);
