import { useEffect, useState } from 'react';
import { Flame, TrendingUp, BookOpen, Brain, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { AppView } from '../types';
import { LESSONS } from '../lib/lessons';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { profile, user } = useAuth();
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [vocabCount, setVocabCount] = useState(0);
  const [lastLesson, setLastLesson] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const [lessonsRes, vocabRes, lastRes] = await Promise.all([
        supabase.from('lessons_completed').select('id').eq('user_id', user.id),
        supabase.from('vocabulary_learned').select('id').eq('user_id', user.id),
        supabase.from('lessons_completed').select('lesson_number').eq('user_id', user.id).order('date_completed', { ascending: false }).limit(1),
      ]);

      setLessonsCompleted(lessonsRes.data?.length || 0);
      setVocabCount(vocabRes.data?.length || 0);
      if (lastRes.data && lastRes.data.length > 0) {
        setLastLesson(lastRes.data[0].lesson_number);
      } else {
        setLastLesson(1);
      }
      setLoading(false);
    };

    fetchStats();
  }, [user]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-300 rounded-lg mb-4"></div>
        </div>
      </div>
    );
  }

  const nextLesson = lastLesson && lastLesson < LESSONS.length ? lastLesson + 1 : lastLesson;
  const currentLessonObj = LESSONS.find((l) => l.id === (lastLesson || 1));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {profile.name}!</h1>
          <p className="text-gray-600">Keep up your streak and master Portuguese today.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Current Streak</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{profile.streak}</p>
                <p className="text-xs text-gray-500 mt-1">days</p>
              </div>
              <Flame className="w-10 h-10 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Level</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{profile.level}</p>
                <p className="text-xs text-gray-500 mt-1">CEFR</p>
              </div>
              <TrendingUp className="w-10 h-10 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Lessons Completed</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{lessonsCompleted}</p>
                <p className="text-xs text-gray-500 mt-1">of {LESSONS.length}</p>
              </div>
              <BookOpen className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Words Learned</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{vocabCount}</p>
                <p className="text-xs text-gray-500 mt-1">vocabulary</p>
              </div>
              <Brain className="w-10 h-10 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl p-8 border border-emerald-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Continue Your Learning</h2>
            {currentLessonObj && (
              <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200 mb-6">
                <p className="text-sm text-gray-600 mb-1">Current Lesson:</p>
                <p className="font-semibold text-gray-900">{currentLessonObj.title}</p>
                <p className="text-xs text-gray-500 mt-1">{currentLessonObj.estimatedMinutes} minutes</p>
              </div>
            )}
            <button
              onClick={() => onNavigate('lesson')}
              className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              Continue Lesson
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-xl p-8 border border-blue-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('chat')}
                className="w-full py-2.5 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors"
              >
                Practice Conversation
              </button>
              <button
                onClick={() => onNavigate('vocabulary')}
                className="w-full py-2.5 bg-purple-50 text-purple-700 font-medium rounded-lg hover:bg-purple-100 transition-colors"
              >
                Vocabulary Review
              </button>
              <button
                onClick={() => onNavigate('progress')}
                className="w-full py-2.5 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                View Progress
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-8 border border-emerald-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Tips to Stay Consistent</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">1.</span>
              <span>Complete one lesson daily to build your streak</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">2.</span>
              <span>Practice conversations with Marina to develop fluency</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">3.</span>
              <span>Review vocabulary regularly to boost retention</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">4.</span>
              <span>Track your progress to stay motivated</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
