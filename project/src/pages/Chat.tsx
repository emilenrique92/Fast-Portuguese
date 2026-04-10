import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ChatMessage } from '../types';
import { Send, MessageCircle, Loader } from 'lucide-react';

export default function Chat() {
  const { user, profile } = useAuth();
  const [scenario, setScenario] = useState<string>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scenarios = [
    { id: 'meeting_people', label: '👋 Meeting People' },
    { id: 'ordering_food', label: '🍽️ Ordering Food' },
    { id: 'travel', label: '✈️ Travel' },
    { id: 'shopping', label: '🛍️ Shopping' },
    { id: 'small_talk', label: '💬 Small Talk' },
    { id: 'opinions', label: '💡 Opinions' },
    { id: 'general', label: '🌍 General' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0 && user) {
      const greeting = `Olá! Me chamo Marina. Vamos praticar Portuguese? I'm here to help you speak Portuguese naturally. What scenario would you like to practice?`;
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [user]);

  const handleSendMessage = async () => {
    if (!input.trim() || !user || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          scenario,
          userLevel: profile?.level || 'A1',
        }),
      });

      const data = await response.json();
      if (data.message) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);

        await supabase.from('conversation_sessions').insert({
          user_id: user.id,
          scenario,
          messages: [...messages, userMessage, { role: 'assistant', content: data.message }],
          message_count: messages.length + 2,
        });
      }
    } catch (err) {
      const errorMsg = 'Desculpe, houve um erro. Pode tentar novamente?';
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 h-[calc(100vh-2rem)] flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            Practice Conversation
          </h1>
          <p className="text-gray-600 mb-4">Chat with Marina to practice your Portuguese skills</p>

          <div className="flex flex-wrap gap-2">
            {scenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setScenario(s.id);
                  setMessages([{ role: 'assistant', content: `Ótimo! Vamos praticar ${s.label}. Comece a conversar!` }]);
                }}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  scenario === s.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-300'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6 overflow-y-auto mb-6">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Marina is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message in Portuguese..."
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <p className="font-semibold mb-1">💡 Tips:</p>
          <ul className="text-xs space-y-1">
            <li>• Marina will gently correct your mistakes</li>
            <li>• Try to write in Portuguese, even if you're unsure</li>
            <li>• She'll suggest natural phrases and explanations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
