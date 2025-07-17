-- Manual fix script to create missing user profiles and fix trigger
-- Run this in your Supabase SQL editor

-- Step 1: First, let's recreate the trigger with better error handling
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
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

    -- Insert into users table
    INSERT INTO public.users (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        user_name,
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- User already exists, just return
        RETURN NEW;
    WHEN others THEN
        -- Log error and continue (don't break auth)
        RAISE LOG 'Error creating user profile for %: %', NEW.email, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Step 2: Create profiles for existing users who don't have them
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

-- Step 3: Verify the fix worked
SELECT 
    'auth.users count' as table_name,
    COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
    'public.users count' as table_name,
    COUNT(*) as count
FROM public.users
UNION ALL
SELECT 
    'missing profiles' as table_name,
    COUNT(*) as count
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL;
