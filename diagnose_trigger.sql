-- Diagnostic script to check trigger and user creation issues
-- Run this in your Supabase SQL editor

-- 1. Check if users exist in auth.users
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- 2. Check if your custom users table exists and its structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check current users in custom users table
SELECT 
    id,
    email,
    name,
    created_at
FROM public.users
ORDER BY created_at DESC;

-- 4. Check if the trigger exists
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement,
    action_condition
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 5. Check if the function exists and its definition
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- 6. Check for any users in auth.users but not in custom users
SELECT 
    au.id,
    au.email,
    au.created_at as auth_created,
    u.id as custom_user_id
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL;

-- 7. Check if there are any error logs (if your Supabase project has logging enabled)
-- This might not work depending on your Supabase setup
-- SELECT * FROM pg_stat_activity WHERE state = 'active';
