import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    const keyFormat = process.env.OPENAI_API_KEY ? 
      (process.env.OPENAI_API_KEY.startsWith('sk-') ? 'valid format' : 'invalid format') : 
      'not found';
    
    return NextResponse.json({
      status: 'API endpoint working',
      hasApiKey,
      keyFormat,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Test endpoint error', details: error },
      { status: 500 }
    );
  }
}
