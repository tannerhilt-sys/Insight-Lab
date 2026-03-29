import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';
import { useAuthStore } from '../store/authStore';
import { getToken } from '../lib/api';

const API_BASE = Platform.OS === 'android'
  ? 'http://10.0.2.2:3001/api/v1'
  : 'http://localhost:3001/api/v1';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hey! I'm your Finance Buddy AI. I can help you with budgeting, investing questions, savings goals, and financial education. What would you like to know?",
  },
];

const suggestions = [
  'How should I start investing?',
  'Help me create a budget',
  'Explain compound interest',
  'Tips to save more money',
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const user = useAuthStore((s) => s.user);
  const buddyName = user?.buddyName || 'Finance Buddy';
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content };
    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '' };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
    setIsTyping(true);

    abortRef.current = new AbortController();

    try {
      const token = await getToken();
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch(`${API_BASE}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: content, history }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          try {
            const parsed = JSON.parse(raw);
            if (parsed.type === 'content_block_delta' && typeof parsed.text === 'string') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + parsed.text } : m
                )
              );
            } else if (parsed.type === 'message_stop') {
              break;
            }
          } catch {
            // skip malformed chunk
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Sorry, I couldn't reach the server. Please check your connection and try again." }
            : m
        )
      );
    } finally {
      setIsTyping(false);
      abortRef.current = null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {/* AI Avatar Header */}
        <View style={styles.aiHeader}>
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={24} color={colors.purple[600]} />
          </View>
          <Text style={styles.aiName}>{buddyName}</Text>
          <Text style={styles.aiSubtitle}>Your AI Financial Companion</Text>
        </View>

        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[styles.messageBubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}
          >
            {msg.role === 'assistant' && (
              <View style={styles.bubbleAvatar}>
                <Ionicons name="sparkles" size={14} color={colors.purple[600]} />
              </View>
            )}
            <View style={[styles.bubbleContent, msg.role === 'user' ? styles.userContent : styles.aiContent]}>
              <Text style={[styles.bubbleText, msg.role === 'user' ? styles.userText : styles.aiText]}>
                {msg.content}
              </Text>
            </View>
          </View>
        ))}

        {isTyping && messages[messages.length - 1]?.content === '' && (
          <View style={[styles.messageBubble, styles.aiBubble]}>
            <View style={styles.bubbleAvatar}>
              <Ionicons name="sparkles" size={14} color={colors.purple[600]} />
            </View>
            <View style={[styles.bubbleContent, styles.aiContent]}>
              <Text style={styles.typingDots}>...</Text>
            </View>
          </View>
        )}

        {/* Suggestions */}
        {messages.length <= 1 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsLabel}>Suggested questions</Text>
            {suggestions.map((s, i) => (
              <TouchableOpacity key={i} style={styles.suggestionChip} onPress={() => sendMessage(s)}>
                <Text style={styles.suggestionText}>{s}</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.primary[600]} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder={`Ask ${buddyName} anything...`}
          placeholderTextColor={colors.slate[400]}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!input.trim() || isTyping) && styles.sendButtonDisabled]}
          onPress={() => sendMessage()}
          disabled={!input.trim() || isTyping}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.slate[50] },
  messageList: { flex: 1 },
  messageContent: { padding: 16, paddingBottom: 8 },

  aiHeader: { alignItems: 'center', marginBottom: 24, paddingTop: 8 },
  aiAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.purple[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  aiName: { fontSize: 18, fontWeight: '700', color: colors.slate[900] },
  aiSubtitle: { fontSize: 13, color: colors.slate[500] },

  messageBubble: { flexDirection: 'row', marginBottom: 12, gap: 8 },
  userBubble: { justifyContent: 'flex-end' },
  aiBubble: { justifyContent: 'flex-start' },
  bubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.purple[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bubbleContent: { maxWidth: '80%', borderRadius: 16, padding: 12 },
  userContent: { backgroundColor: colors.primary[600], borderBottomRightRadius: 4 },
  aiContent: { backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.slate[200] },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  userText: { color: '#fff' },
  aiText: { color: colors.slate[800] },
  typingDots: { fontSize: 24, color: colors.slate[400], letterSpacing: 4 },

  suggestionsContainer: { marginTop: 8 },
  suggestionsLabel: { fontSize: 13, fontWeight: '600', color: colors.slate[500], marginBottom: 8 },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.slate[200],
  },
  suggestionText: { fontSize: 14, color: colors.slate[700], flex: 1 },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.slate[200],
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.slate[900],
    maxHeight: 100,
    backgroundColor: colors.slate[50],
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: { opacity: 0.5 },
});
