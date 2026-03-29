import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { api } from '@/lib/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
  suggestions: string[];

  sendMessage: (message: string) => Promise<void>;
  fetchSuggestions: () => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isStreaming: false,
  error: null,
  suggestions: [
    'How should I start investing?',
    'Explain my budget breakdown',
    'What stocks should I watch?',
    'How do I build an emergency fund?',
    'Teach me about compound interest',
  ],

  sendMessage: async (message) => {
    if (!message.trim()) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };
    const assistantMsg: ChatMessage = {
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };

    // Add both messages atomically to avoid race conditions
    set((state) => ({
      messages: [...state.messages, userMsg, assistantMsg],
      isStreaming: true,
      error: null,
    }));

    const MAX_RETRIES = 3;
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < MAX_RETRIES) {
      try {
        const token = useAuthStore.getState().token;
        const history = get().messages.slice(-20, -2); // exclude the two messages we just added

        const response = await fetch('/api/v1/chat/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ message: message.trim(), history }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errMsg = (errorData as { error?: string }).error || `Request failed: ${response.status}`;
          // 4xx errors are client errors — do not retry
          if (response.status >= 400 && response.status < 500) throw Object.assign(new Error(errMsg), { noRetry: true });
          throw new Error(errMsg);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          // On retry, clear any partial content streamed in a previous attempt
          if (attempt > 0) {
            set((state) => {
              const msgs = [...state.messages];
              const lastIdx = msgs.length - 1;
              if (msgs[lastIdx]?.role === 'assistant') {
                msgs[lastIdx] = { ...msgs[lastIdx], content: '' };
              }
              return { messages: msgs };
            });
          }

          let done = false;
          while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            if (!value) continue;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const rawData = line.slice(6).trim();
              if (!rawData || rawData === '[DONE]') continue;

              try {
                const parsed = JSON.parse(rawData) as { type: string; text?: string; error?: string };
                if (parsed.type === 'content_block_delta' && typeof parsed.text === 'string') {
                  set((state) => {
                    const msgs = [...state.messages];
                    const lastIdx = msgs.length - 1;
                    if (msgs[lastIdx]?.role === 'assistant') {
                      msgs[lastIdx] = { ...msgs[lastIdx], content: msgs[lastIdx].content + parsed.text };
                    }
                    return { messages: msgs };
                  });
                }
              } catch {
                // Malformed SSE chunk — skip silently
              }
            }
          }
        }

        // Success — exit retry loop
        set({ isStreaming: false });
        return;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Connection failed');
        // Do not retry client errors (4xx)
        if ((lastError as Error & { noRetry?: boolean }).noRetry) break;

        attempt++;
        if (attempt < MAX_RETRIES) {
          // Exponential backoff: 1s → 2s → 4s
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    // All retries exhausted — show error in the assistant bubble
    const errorMessage = lastError?.message ?? 'Connection failed. Please try again.';
    set((state) => {
      const msgs = [...state.messages];
      const lastIdx = msgs.length - 1;
      if (msgs[lastIdx]?.role === 'assistant' && !msgs[lastIdx].content) {
        msgs[lastIdx] = {
          ...msgs[lastIdx],
          content: "I'm having trouble connecting right now. Please try again in a moment!",
        };
      }
      return { messages: msgs, error: errorMessage, isStreaming: false };
    });
  },

  fetchSuggestions: async () => {
    try {
      const data = await api<{ suggestions: string[] }>('/chat/suggestions');
      if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        set({ suggestions: data.suggestions });
      }
    } catch {
      // keep default suggestions on failure
    }
  },

  clearMessages: () => set({ messages: [] }),
  clearError: () => set({ error: null }),
}));
