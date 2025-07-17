-- Test script to verify user signup functionality
-- Run these queries in your Supabase SQL editor AFTER running the migration

-- 1. Check if the trigger exists
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 2. Check if the function exists
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- 3. Check current users in auth.users
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC;

-- 4. Check current users in custom users table
SELECT 
    id,
    email,
    name,
    created_at,
    subscription_tier,
    subscription_status
FROM users
ORDER BY created_at DESC;

-- 5. Check for users in auth.users but not in custom users table
SELECT 
    au.id,
    au.email,
    au.created_at as auth_created_at,
    u.id as custom_user_id
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE u.id IS NULL;

-- 6. Manual test: If you want to manually trigger the function for existing users
-- (Uncomment and run this if needed)
-- SELECT handle_new_user() FROM auth.users WHERE id = 'YOUR_USER_ID_HERE';
