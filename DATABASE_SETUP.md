# Database Setup Guide

This guide walks you through setting up the Supabase database for your AI Chatbot Business Solution.

## 📋 Prerequisites

- Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Your OpenAI API key

## 🚀 Quick Setup

### 1. Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in your project details:
   - Name: `ai-chatbot-business`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
5. Click "Create new project"

### 2. Get Your Supabase Credentials

1. Go to Project Settings → API
2. Copy the following values:
   - **Project URL** (anon public)
   - **Project API Key** (anon public)  
   - **Service Role Key** (service_role - keep this secret!)

### 3. Set Up Environment Variables

1. Create a `.env.local` file in your project root:
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your credentials:
```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Run the Database Schema

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Click "Run" to create all tables, indexes, and functions

### 5. Set Up Row Level Security (Optional but Recommended)

1. In the SQL Editor, run the contents of `supabase/rls-policies.sql`
2. This sets up security policies to ensure users can only access their own data

### 6. Add Sample Data (Optional)

1. In the SQL Editor, run the contents of `supabase/seed.sql`
2. This adds sample users, businesses, and chat data for testing

## 📊 Database Schema Overview

### Core Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts with subscription info |
| `businesses` | Business profiles owned by users |
| `chatbot_configurations` | Chatbot settings per business |
| `chat_sessions` | Individual chat sessions |
| `chat_messages` | Messages within chat sessions |
| `analytics` | Daily analytics per business |
| `knowledge_base` | Custom knowledge base entries |
| `api_usage` | API usage tracking |
| `subscriptions` | Subscription management |
| `webhook_logs` | Webhook event logs |

### Key Relationships

```
users (1) → (many) businesses
businesses (1) → (1) chatbot_configurations
businesses (1) → (many) chat_sessions
chat_sessions (1) → (many) chat_messages
businesses (1) → (many) analytics
businesses (1) → (many) knowledge_base
```

## 🔧 Testing the Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Test Database Connection
```bash
npm run dev
```

### 3. Test API Endpoints
- Visit `http://localhost:3000/api/config?businessId=660e8400-e29b-41d4-a716-446655440000`
- Should return chatbot configuration for the sample business

### 4. Test Dashboard
- Visit `http://localhost:3000/auth` to sign in
- Visit `http://localhost:3000/dashboard` to test configuration management

## 🛡️ Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Public access allowed for widget functionality
- Service role can insert chat data from widgets

### Data Validation
- Input validation on all API endpoints
- SQL injection prevention through parameterized queries
- Rate limiting on sensitive operations

## 📈 Analytics & Monitoring

### Built-in Analytics
- Daily session counts
- Message volumes
- User engagement metrics
- Top questions tracking

### Custom Functions
- `get_business_analytics()` - Comprehensive analytics
- `update_message_counts()` - Auto-update counters
- `reset_monthly_messages()` - Monthly quota reset

## 🔄 Maintenance

### Monthly Tasks
- Run `reset_monthly_messages()` function
- Clean up old chat sessions
- Update analytics summaries

### Backup Strategy
- Supabase handles automated backups
- Export critical data regularly
- Test restore procedures

## 📱 Production Deployment

### Environment Variables
```env
# Production URLs
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Performance Optimization
- Database indexes are pre-configured
- Connection pooling handled by Supabase
- Query optimization for common operations

## 🐛 Troubleshooting

### Common Issues

**Connection Errors**
- Check environment variables
- Verify Supabase project status
- Check network connectivity

**Permission Errors**
- Verify RLS policies are correct
- Check user authentication
- Ensure proper API key usage

**Performance Issues**
- Monitor database usage in Supabase dashboard
- Check query performance
- Consider upgrading Supabase plan

### Useful SQL Queries

```sql
-- Check recent activity
SELECT * FROM chat_sessions 
WHERE created_at > NOW() - INTERVAL '24 hours';

-- Get user message counts
SELECT u.email, u.total_messages, u.monthly_messages 
FROM users u 
ORDER BY u.total_messages DESC;

-- Business analytics summary
SELECT b.name, COUNT(cs.id) as sessions, COUNT(cm.id) as messages
FROM businesses b
LEFT JOIN chat_sessions cs ON b.id = cs.business_id
LEFT JOIN chat_messages cm ON cs.id = cm.session_id
GROUP BY b.id, b.name;
```

## 📞 Support

For issues with:
- **Database schema**: Check the SQL files in `/supabase/`
- **API connectivity**: Verify environment variables
- **Performance**: Monitor Supabase dashboard
- **Security**: Review RLS policies

## 🎯 Next Steps

1. ✅ Set up Supabase project
2. ✅ Run database schema
3. ✅ Configure environment variables
4. ✅ Test basic functionality
5. 🔄 Customize for your needs
6. 🚀 Deploy to production

Your AI Chatbot database is now ready for production! 🎉
