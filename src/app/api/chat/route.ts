import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid messages format:', messages);
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found in environment variables');
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    // Check if API key looks valid (starts with sk-)
    if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
      console.error('Invalid OpenAI API key format');
      return NextResponse.json(
        { error: 'Invalid OpenAI API key format. Make sure your key starts with "sk-"' },
        { status: 500 }
      );
    }

    // Add system message to clarify knowledge limitations
    const systemMessage = {
      role: 'system' as const,
      content: `You are a helpful AI assistant. Your knowledge has a cutoff date of April 2024, so you may not have information about very recent events. When users ask about current events, recent news, or real-time information, please:
1. Provide what information you have up to your knowledge cutoff
2. Clearly mention that your information may not be current
3. Suggest they check recent news sources, official websites, or search engines for the latest information
4. Be helpful with the information you do have while being transparent about limitations.`
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Latest model with up-to-date knowledge and great performance
      messages: [systemMessage, ...messages],
      stream: false,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const message = completion.choices[0]?.message;
    
    if (!message) {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    
    // Handle specific OpenAI errors
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key' },
        { status: 401 }
      );
    }
    
    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
