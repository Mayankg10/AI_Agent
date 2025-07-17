import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { messages, businessId } = await request.json();

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid messages format:', messages);
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Process messages to handle file content
    const processedMessages = messages.map((message: any) => {
      if (message.role === 'user' && typeof message.content === 'string') {
        // Check if message contains file content
        if (message.content.includes('📎 File:')) {
          // Extract file info and content
          const lines = message.content.split('\n');
          const fileInfo = lines.find(line => line.startsWith('📎 File:'));
          const textContent = lines.filter(line => !line.startsWith('📎 File:') && line.trim()).join('\n');
          
          if (fileInfo) {
            const fileName = fileInfo.replace('📎 File:', '').trim();
            const isImage = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(fileName);
            
            if (isImage) {
              // For images, provide a helpful response about image analysis
              return {
                role: 'user',
                content: `I've shared an image file (${fileName}). ${textContent || 'Can you help me understand what this image shows?'}`
              };
            } else {
              // For other files, include the content in the message
              return {
                role: 'user',
                content: `I've shared a file (${fileName}). ${textContent}\n\nFile content:\n${message.content.split('\n').slice(1).join('\n')}`
              };
            }
          }
        }
      }
      return message;
    });

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

    // Add system message to clarify knowledge limitations and file handling
    const systemMessage = {
      role: 'system' as const,
      content: `You are a helpful AI assistant. Your knowledge has a cutoff date of April 2024, so you may not have information about very recent events. When users ask about current events, recent news, or real-time information, please:
1. Provide what information you have up to your knowledge cutoff
2. Clearly mention that your information may not be current
3. Suggest they check recent news sources, official websites, or search engines for the latest information
4. Be helpful with the information you do have while being transparent about limitations.

Regarding file uploads:
- When users share text files, code files, or documents, you can analyze and help with their content
- When users share images, acknowledge the image but explain that you cannot directly view or analyze images in this interface
- Always be helpful and provide relevant guidance based on the file type and any accompanying text`
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Latest model with up-to-date knowledge and great performance
      messages: [systemMessage, ...processedMessages],
      stream: true,
      max_tokens: 1000,
      temperature: 0.7,
    });

    // Create a ReadableStream for streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const data = `data: ${JSON.stringify({ content })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          
          // Send final message to indicate completion
          const data = `data: ${JSON.stringify({ finished: true })}\n\n`;
          controller.enqueue(encoder.encode(data));
          controller.close();
        } catch (error) {
          const errorData = `data: ${JSON.stringify({ error: 'Stream error' })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
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
