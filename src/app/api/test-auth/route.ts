import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      return NextResponse.json({
        error: 'Database connection failed',
        details: connectionError.message
      }, { status: 500 });
    }

    // Test auth service
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    return NextResponse.json({
      success: true,
      connection: 'OK',
      auth_service: authError ? 'ERROR' : 'OK',
      auth_error: authError?.message || null,
      message: 'Test completed successfully'
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
