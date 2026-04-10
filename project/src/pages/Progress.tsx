import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { BarChart3, TrendingUp, Zap, BookOpen } from 'lucide-react';
import { LESSONS, LEVEL_ORDER } from '../lib/lessons';

export default function Progress() {
  const { user, profile } = useAuth();
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [vocabCount, setVocabCount] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const [lessonsRes, vocabRes] = await Promise.all([
        supabase.from('lessons_completed').select('id, date_completed').eq('user_id', user.id),
        supabase.from('vocabulary_learned').select('id, mastery').eq('user_id', user.id),
      ]);

      setLessonsCompleted(lessonsRes.data?.length || 0);
      setVocabCount(vocabRes.data?.length || 0);

      const masteredWords = vocabRes.data?.filter((w: any) => w.mastery >= 3).length || 0;
      setStats({
        lessonsCompleted: lessonsRes.data?.length || 0,
        totalWords: vocabRes.data?.length || 0,
        masteredWords,
        masteryPercent: vocabRes.data?.length ? Math.round((masteredWords / vocabRes.data.length) * 100) : 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, [user]);

  const currentLevelIdx = LEVEL_ORDER[profile?.level || 'A0'] || 0;
  const progressPercent = ((currentLevelIdx + 1) / 4) * 100;
  const completionPercent = lessonsCompleted > 0 ? (lessonsCompleted / LESSONS.length) * 100 : 0;

  if (loading || !stats) {
    return <div className="text-center py-20">Loading progress...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-emerald-600" />
            Your Progress
          </h1>
          <p className="text-gray-600">Track your journey to fluency</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Current Level</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{profile?.level || 'A0'}</p>
                <p className="text-xs text-gray-500 mt-1">CEFR Level</p>
              </div>
              <TrendingUp className="w-10 h-10 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Lessons Completed</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.lessonsCompleted}</p>
                <p className="text-xs text-gray-500 mt-1">of {LESSONS.length}</p>
              </div>
              <BookOpen className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Words Learned</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{stats.totalWords}</p>
                <p className="text-xs text-gray-500 mt-1">vocabulary</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Mastered Words</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.masteryPercent}%</p>
                <p className="text-xs text-gray-500 mt-1">{stats.masteredWords} words</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Level Progress</h2>
            <div className="space-y-4">
              {['A0', 'A1', 'A2', 'B1'].map((level, i) => (
                <div key={level}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{level}</span>
                    <span className="text-xs text-gray-500">
                      {i <= currentLevelIdx ? 'Completed' : 'Locked'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${i <= currentLevelIdx ? 'bg-emerald-500' : 'bg-gray-300'}`}
                      style={{ width: i <= currentLevelIdx ? '100%' : '0%' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Lesson Completion</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    strokeDasharray={`${(completionPercent / 100) * 282.7} 282.7`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{Math.round(completionPercent)}%</p>
                    <p className="text-xs text-gray-500">Complete</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-700">
              {stats.lessonsCompleted} of {LESSONS.length} lessons completed
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-8 border border-emerald-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">🎯 Next Milestones</h2>
          <div className="space-y-3">
            {[
              { target: 5, label: 'Complete 5 lessons', current: stats.lessonsCompleted },
              { target: 100, label: 'Learn 100 words', current: stats.totalWords },
              { target: 10, label: 'Complete all lessons', current: stats.lessonsCompleted },
              { target: 50, label: 'Reach 50% word mastery', current: stats.masteryPercent },
            ].map((milestone, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{milestone.label}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {Math.min(milestone.current, milestone.target)}/{milestone.target}
                  </span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-emerald-200">
                  <div
                    className="h-full bg-emerald-600 transition-all"
                    style={{ width: `${Math.min((milestone.current / milestone.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
