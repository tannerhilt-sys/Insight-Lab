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

    try {
      // Use the auth store as single source of truth for the token
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
        throw new Error((errorData as { error?: string }).error || `Request failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
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
                // Append only the typed text delta to the last (assistant) message
                set((state) => {
                  const msgs = [...state.messages];
                  const lastIdx = msgs.length - 1;
                  if (msgs[lastIdx]?.role === 'assistant') {
                    msgs[lastIdx] = { ...msgs[lastIdx], content: msgs[lastIdx].content + parsed.text };
                  }
                  return { messages: msgs };
                });
              }
              // message_stop signals end — handled by reader loop completing
            } catch {
              // Malformed SSE chunk — skip silently
            }
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connection failed. Please try again.';
      set((state) => {
        const msgs = [...state.messages];
        const lastIdx = msgs.length - 1;
        // If the assistant message is still empty, replace it with a friendly error
        if (msgs[lastIdx]?.role === 'assistant' && !msgs[lastIdx].content) {
          msgs[lastIdx] = {
            ...msgs[lastIdx],
            content: "I'm having trouble connecting right now. Please try again in a moment!",
          };
        }
        return { messages: msgs, error: message };
      });
    } finally {
      set({ isStreaming: false });
    }
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
