import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserById } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    // Get user profile from database
    try {
      const userProfile = await getUserById(authData.user.id);
      
      return NextResponse.json({
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: userProfile.name,
          avatar_url: userProfile.avatar_url,
          subscription_tier: userProfile.subscription_tier,
          subscription_status: userProfile.subscription_status
        },
        session: authData.session,
        message: 'Signed in successfully'
      });
    } catch (profileError) {
      console.error('Profile fetch error:', profileError);
      // Return basic user info if profile fetch fails
      return NextResponse.json({
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: authData.user.user_metadata?.name || authData.user.email,
        },
        session: authData.session,
        message: 'Signed in successfully'
      });
    }

  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
