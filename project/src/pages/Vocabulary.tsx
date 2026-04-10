import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { VocabularyWord } from '../types';
import { BookOpen, Trash2, RotateCcw } from 'lucide-react';

export default function Vocabulary() {
  const { user } = useAuth();
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'learning' | 'mastered'>('all');

  useEffect(() => {
    if (!user) return;

    const fetchWords = async () => {
      const { data } = await supabase
        .from('vocabulary_learned')
        .select('*')
        .eq('user_id', user.id)
        .order('learned_date', { ascending: false });
      setWords((data as VocabularyWord[]) || []);
      setLoading(false);
    };

    fetchWords();
  }, [user]);

  const filteredWords = words.filter((w) => {
    if (filter === 'all') return true;
    if (filter === 'learning') return w.mastery < 3;
    if (filter === 'mastered') return w.mastery >= 3;
    return true;
  });

  const handleDelete = async (id: string) => {
    await supabase.from('vocabulary_learned').delete().eq('id', id);
    setWords(words.filter((w) => w.id !== id));
  };

  const handleReview = async (id: string) => {
    const word = words.find((w) => w.id === id);
    if (!word) return;

    await supabase
      .from('vocabulary_learned')
      .update({
        review_count: (word.review_count || 0) + 1,
        mastery: Math.min(5, (word.mastery || 0) + 1),
      })
      .eq('id', id);

    setWords(words.map((w) => (w.id === id ? { ...w, review_count: (w.review_count || 0) + 1, mastery: Math.min(5, (w.mastery || 0) + 1) } : w)));
  };

  if (loading) {
    return <div className="text-center py-20">Loading vocabulary...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-purple-600" />
            My Vocabulary
          </h1>
          <p className="text-gray-600">
            {words.length} words learned • Review regularly to master Portuguese
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          {['all', 'learning', 'mastered'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'All' : f === 'learning' ? 'Learning' : 'Mastered'} ({
                f === 'all' ? words.length : f === 'learning' ? words.filter((w) => w.mastery < 3).length : words.filter((w) => w.mastery >= 3).length
              })
            </button>
          ))}
        </div>

        {filteredWords.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No words yet. Start a lesson to build your vocabulary!</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredWords.map((word) => (
              <div
                key={word.id}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-bold text-gray-900">{word.word}</p>
                      <p className="text-gray-600 text-sm">{word.translation}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < word.mastery ? 'bg-purple-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">{word.review_count} reviews</p>
                  </div>

                  <button
                    onClick={() => handleReview(word.id)}
                    className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Mark as reviewed"
                  >
                    <RotateCcw className="w-4 h-4 text-purple-600" />
                  </button>

                  <button
                    onClick={() => handleDelete(word.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete word"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="font-bold text-gray-900 mb-4">📚 Mastery Levels</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { level: 1, desc: 'Saw it once' },
              { level: 2, desc: 'Recognize it' },
              { level: 3, desc: 'Can use it' },
              { level: 4, desc: 'Use it often' },
              { level: 5, desc: 'Mastered!' },
            ].map(({ level, desc }) => (
              <div key={level} className="text-center">
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < level ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm font-medium text-gray-900">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
