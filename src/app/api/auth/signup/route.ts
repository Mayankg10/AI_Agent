import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createBusiness } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { email, password, businessName, fullName } = await request.json();

    // Basic validation
    if (!email || !password || !businessName || !fullName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: fullName,
          business_name: businessName
        }
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create business for the user
    try {
      const business = await createBusiness({
        user_id: authData.user.id,
        name: businessName,
        description: null,
        website_url: null,
        logo_url: null,
        industry: null
      });

      console.log('Business created:', business);
    } catch (businessError) {
      console.error('Business creation error:', businessError);
      // Continue even if business creation fails
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: fullName,
        business_name: businessName
      },
      message: 'Account created successfully'
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
