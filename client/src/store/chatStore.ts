import { create } from 'zustand';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  suggestions: string[];

  sendMessage: (message: string) => Promise<void>;
  fetchSuggestions: () => Promise<void>;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isStreaming: false,
  suggestions: [
    'How should I start investing?',
    'Explain my budget breakdown',
    'What stocks should I watch?',
    'How do I build an emergency fund?',
    'Teach me about compound interest',
  ],

  sendMessage: async (message) => {
    const userMsg: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isStreaming: true,
    }));

    const assistantMsg: ChatMessage = {
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, assistantMsg],
    }));

    try {
      const token = localStorage.getItem('finance-buddy-token');
      const response = await fetch('/api/v1/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error('Chat request failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            // Parse SSE data
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(data);
                  const text = parsed.content || parsed.text || data;
                  set((state) => {
                    const msgs = [...state.messages];
                    const last = msgs[msgs.length - 1];
                    if (last.role === 'assistant') {
                      msgs[msgs.length - 1] = {
                        ...last,
                        content: last.content + text,
                      };
                    }
                    return { messages: msgs };
                  });
                } catch {
                  // If not JSON, treat as plain text chunk
                  set((state) => {
                    const msgs = [...state.messages];
                    const last = msgs[msgs.length - 1];
                    if (last.role === 'assistant') {
                      msgs[msgs.length - 1] = {
                        ...last,
                        content: last.content + data,
                      };
                    }
                    return { messages: msgs };
                  });
                }
              }
            }
          }
        }
      }
    } catch {
      // On error, provide a fallback response
      set((state) => {
        const msgs = [...state.messages];
        const last = msgs[msgs.length - 1];
        if (last.role === 'assistant' && !last.content) {
          msgs[msgs.length - 1] = {
            ...last,
            content:
              "I'm having trouble connecting right now. Please try again in a moment!",
          };
        }
        return { messages: msgs };
      });
    } finally {
      set({ isStreaming: false });
    }
  },

  fetchSuggestions: async () => {
    try {
      const token = localStorage.getItem('finance-buddy-token');
      const response = await fetch('/api/v1/chat/suggestions', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.suggestions) {
          set({ suggestions: data.suggestions });
        }
      }
    } catch {
      // keep default suggestions
    }
  },

  clearMessages: () => set({ messages: [] }),
}));
