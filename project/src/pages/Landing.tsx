import { BookOpen, Zap, Brain, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { AppView } from '../types';

interface LandingProps {
  onNavigate: (view: AppView) => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-emerald-600">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span>Fast<span className="text-gray-800">Portuguese</span></span>
          </div>
          <button
            onClick={() => onNavigate('auth')}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
          >
            Sign in
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn Portuguese Fast
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The fastest way for Spanish speakers to speak Brazilian Portuguese conversationally.
          </p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-8 py-4 rounded-lg bg-emerald-600 text-white font-semibold text-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Start learning free
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-xl border border-emerald-100">
            <Zap className="w-12 h-12 text-emerald-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Daily Micro-Lessons</h3>
            <p className="text-gray-600">
              10-15 minute lessons focused on high-frequency vocabulary and real conversations.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl border border-blue-100">
            <MessageSquare className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI Conversation Partner</h3>
            <p className="text-gray-600">
              Practice real conversations with Marina, your AI Brazilian Portuguese tutor.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl border border-purple-100">
            <Brain className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Spaced Repetition</h3>
            <p className="text-gray-600">
              Smart algorithm ensures you remember vocabulary through optimal review timing.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Fast Portuguese?</h2>
            <ul className="space-y-4">
              {[
                'Designed specifically for Spanish speakers',
                'Focuses on Brazilian Portuguese conversational skills',
                'From A0 (beginner) to B1 (intermediate) fluency',
                'Daily streaks and progress tracking',
                'Pronunciation training for tricky sounds',
                'Real-life scenarios: ordering, travel, meeting people',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 flex-shrink-0 mt-1 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-8 border border-emerald-200">
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-4 border border-emerald-100">
                <p className="font-semibold text-gray-900 mb-2">📚 10 Complete Lessons</p>
                <p className="text-sm text-gray-600">From greetings to travel conversations</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-emerald-100">
                <p className="font-semibold text-gray-900 mb-2">🎯 High-Frequency Vocabulary</p>
                <p className="text-sm text-gray-600">1000+ essential words & phrases</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-emerald-100">
                <p className="font-semibold text-gray-900 mb-2">🗣️ Pronunciation Guides</p>
                <p className="text-sm text-gray-600">Master tricky Brazilian sounds</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-emerald-100">
                <p className="font-semibold text-gray-900 mb-2">✨ Premium Features</p>
                <p className="text-sm text-gray-600">Unlimited practice & conversations</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-emerald-600 text-white rounded-xl p-12 text-center mb-20">
          <h2 className="text-3xl font-bold mb-4">Ready to speak Portuguese?</h2>
          <p className="text-lg mb-8 opacity-90">Start your free account today and join thousands of Spanish speakers learning Brazilian Portuguese.</p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-8 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get started for free
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center py-8">
          <div>
            <p className="text-3xl font-bold text-emerald-600">10</p>
            <p className="text-gray-600">Complete lessons</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-600">∞</p>
            <p className="text-gray-600">Practice conversations</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-600">0%</p>
            <p className="text-gray-600">Pressure or stress</p>
          </div>
        </div>
      </div>

      <footer className="bg-gray-50 border-t border-gray-100 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>Fast Portuguese © 2025. Learn Brazilian Portuguese at your own pace.</p>
        </div>
      </footer>
    </div>
  );
}
