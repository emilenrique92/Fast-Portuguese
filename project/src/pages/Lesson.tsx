import { useState, useEffect } from 'react';
import { LESSONS, getLessonById, getNextLevel } from '../lib/lessons';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, CheckCircle2, Volume2 } from 'lucide-react';

export default function Lesson() {
  const { user, profile, refreshProfile } = useAuth();
  const [currentLessonId, setCurrentLessonId] = useState(1);
  const [section, setSection] = useState<'phrases' | 'grammar' | 'dialogue' | 'pronunciation' | 'quiz' | 'speaking'>('phrases');
  const [quizProgress, setQuizProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const lesson = getLessonById(currentLessonId);

  useEffect(() => {
    const fetchLastLesson = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('lessons_completed')
        .select('lesson_number')
        .eq('user_id', user.id)
        .order('date_completed', { ascending: false })
        .limit(1);
      if (data && data.length > 0) {
        const lastCompleted = data[0].lesson_number;
        if (lastCompleted < LESSONS.length) {
          setCurrentLessonId(lastCompleted + 1);
        }
      }
    };
    fetchLastLesson();
  }, [user]);

  const handleCompleteLesson = async () => {
    if (!user || !lesson) return;
    setLoading(true);

    const newLevel = profile?.level ? getNextLevel(profile.level) : 'A1';

    await Promise.all([
      supabase.from('lessons_completed').insert({
        user_id: user.id,
        lesson_number: lesson.id,
        score: 100,
      }),
      supabase.from('profiles').update({
        level: newLevel,
        streak: (profile?.streak || 0) + 1,
      }).eq('id', user.id),
      ...lesson.vocabulary.map((v) =>
        supabase.from('vocabulary_learned').insert({
          user_id: user.id,
          word: v.word,
          translation: v.translation,
        })
      ),
    ]);

    await refreshProfile();
    if (lesson.id < LESSONS.length) {
      setCurrentLessonId(lesson.id + 1);
      setSection('phrases');
    }
    setLoading(false);
  };

  if (!lesson) {
    return <div className="text-center py-20">Lesson not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
          <span className="text-sm font-semibold px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
            {lesson.level}
          </span>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['phrases', 'grammar', 'dialogue', 'pronunciation', 'quiz', 'speaking'].map((s) => (
            <button
              key={s}
              onClick={() => setSection(s as any)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                section === s
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm mb-8">
          {section === 'phrases' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Key Phrases</h2>
              {lesson.phrases.map((phrase, i) => (
                <div key={i} className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-100">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-gray-900">{phrase.portuguese}</p>
                      <p className="text-emerald-600 font-medium">{phrase.spanish}</p>
                      <p className="text-sm text-gray-600 mt-1 italic">{phrase.phonetic}</p>
                    </div>
                    <button className="p-2 hover:bg-white rounded-lg transition-colors">
                      <Volume2 className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 border-t border-emerald-200 pt-2 mt-2">
                    <span className="font-semibold">Example:</span> {phrase.example}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    <span className="font-semibold">Native usage:</span> {phrase.nativeUsage}
                  </p>
                </div>
              ))}
            </div>
          )}

          {section === 'grammar' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{lesson.grammar.title}</h2>
              <p className="text-gray-700 mb-6">{lesson.grammar.explanation}</p>
              <div className="space-y-3">
                {lesson.grammar.examples.map((ex, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-900">{ex.portuguese}</p>
                    <p className="text-gray-600 text-sm">{ex.spanish}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'dialogue' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sample Dialogue</h2>
              <div className="space-y-3">
                {lesson.dialogue.map((line, i) => (
                  <div key={i} className={`p-4 rounded-lg ${line.speaker === 'A' ? 'bg-emerald-50 border border-emerald-200' : 'bg-blue-50 border border-blue-200'}`}>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Person {line.speaker}</p>
                    <p className="font-semibold text-gray-900">{line.portuguese}</p>
                    <p className="text-gray-600 text-sm">{line.spanish}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'pronunciation' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Pronunciation Tips</h2>
              {lesson.pronunciationTips.map((tip, i) => (
                <div key={i} className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="font-bold text-gray-900">{tip.sound}</p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-semibold">Phonetic:</span> {tip.phonetic}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Example:</span> {tip.example}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Tip:</span> {tip.tip}
                  </p>
                </div>
              ))}
            </div>
          )}

          {section === 'quiz' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Check</h2>
              {lesson.quiz.map((q, i) => (
                <div key={i} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-3">{q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, j) => (
                      <button
                        key={j}
                        className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-colors text-gray-700"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">{q.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {section === 'speaking' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Speaking Challenge</h2>
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-gray-700 mb-4">{lesson.speakingChallenge}</p>
                <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Record Response
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentLessonId(Math.max(1, currentLessonId - 1))}
            disabled={currentLessonId === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={handleCompleteLesson}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            {loading ? 'Saving...' : 'Complete Lesson'}
          </button>

          <button
            onClick={() => setCurrentLessonId(Math.min(LESSONS.length, currentLessonId + 1))}
            disabled={currentLessonId === LESSONS.length}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
