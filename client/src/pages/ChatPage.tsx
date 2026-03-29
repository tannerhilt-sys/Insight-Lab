import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const user = useAuthStore((s) => s.user);
  const { messages, isStreaming, suggestions, sendMessage } = useChatStore();

  const buddyName = user?.buddyName || 'Finance Buddy';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (suggestion: string) => {
    if (isStreaming) return;
    sendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] -m-4 lg:-m-8">
      {/* Chat header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-3 shrink-0">
        <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{buddyName}</h3>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-500">Online</span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-4 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Chat with {buddyName}
            </h3>
            <p className="text-slate-500 max-w-md mb-8">
              Ask me anything about budgeting, investing, saving, or financial concepts.
              I'm here to help you on your financial journey!
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(s)}
                  className="px-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm text-slate-700
                             hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-all
                             shadow-sm hover:shadow"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-primary-600'
                  : 'bg-gradient-to-br from-primary-500 to-purple-600'
              }`}
            >
              {msg.role === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Sparkles className="w-4 h-4 text-white" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white rounded-br-md'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md shadow-sm'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <p
                className={`text-xs mt-2 ${
                  msg.role === 'user' ? 'text-primary-200' : 'text-slate-400'
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isStreaming && messages[messages.length - 1]?.content === '' && (
          <div className="flex items-end gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions (when there are messages) */}
      {messages.length > 0 && !isStreaming && (
        <div className="px-4 lg:px-6 pb-2 flex gap-2 flex-wrap">
          {suggestions.slice(0, 3).map((s, i) => (
            <button
              key={i}
              onClick={() => handleSuggestion(s)}
              className="px-3 py-1.5 bg-slate-100 rounded-full text-xs text-slate-600
                         hover:bg-primary-100 hover:text-primary-700 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="px-4 lg:px-6 py-4 bg-white border-t border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 input"
            placeholder={`Ask ${buddyName} anything...`}
            disabled={isStreaming}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isStreaming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
