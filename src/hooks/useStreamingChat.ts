import { useState, useCallback, useRef } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isEdited?: boolean;
  feedback?: 'positive' | 'negative' | null;
}

interface StreamingChatOptions {
  onMessageStart?: (messageId: string) => void;
  onMessageChunk?: (messageId: string, chunk: string, fullContent: string) => void;
  onMessageComplete?: (messageId: string, fullContent: string) => void;
  onError?: (error: string) => void;
}

export const useStreamingChat = (options: StreamingChatOptions = {}) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (
    messages: Omit<Message, 'id' | 'timestamp'>[]
  ): Promise<string> => {
    setIsStreaming(true);
    const messageId = Date.now().toString();
    setStreamingMessageId(messageId);
    
    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();
    
    let fullContent = '';
    
    try {
      options.onMessageStart?.(messageId);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                throw new Error(data.error);
              }
              
              if (data.finished) {
                options.onMessageComplete?.(messageId, fullContent);
                return fullContent;
              }
              
              if (data.content) {
                fullContent += data.content;
                options.onMessageChunk?.(messageId, data.content, fullContent);
              }
            } catch (parseError) {
              // Skip invalid JSON lines
              continue;
            }
          }
        }
      }
      
      return fullContent;
      
    } catch (error: any) {
      if (error.name === 'AbortError') {
        options.onError?.('Message generation was cancelled');
      } else {
        options.onError?.(error.message || 'An error occurred');
      }
      return '';
    } finally {
      setIsStreaming(false);
      setStreamingMessageId(null);
      abortControllerRef.current = null;
    }
  }, [options]);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    sendMessage,
    stopStreaming,
    isStreaming,
    streamingMessageId,
  };
};
