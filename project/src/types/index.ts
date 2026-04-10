export interface Profile {
  id: string;
  name: string;
  email: string;
  level: CEFRLevel;
  streak: number;
  last_session_date: string | null;
  is_premium: boolean;
  created_at: string;
}

export type CEFRLevel = 'A0' | 'A1' | 'A2' | 'B1';

export interface LessonCompleted {
  id: string;
  user_id: string;
  lesson_number: number;
  score: number;
  date_completed: string;
}

export interface VocabularyWord {
  id: string;
  user_id: string;
  word: string;
  translation: string;
  next_review: string;
  review_count: number;
  mastery: number;
  learned_date: string;
}

export interface ConversationSession {
  id: string;
  user_id: string;
  scenario: string;
  messages: ChatMessage[];
  message_count: number;
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface Phrase {
  portuguese: string;
  spanish: string;
  phonetic: string;
  example: string;
  nativeUsage: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface DialogueLine {
  speaker: 'A' | 'B';
  portuguese: string;
  spanish: string;
}

export interface GrammarNote {
  title: string;
  explanation: string;
  examples: { portuguese: string; spanish: string }[];
}

export interface PronunciationTip {
  sound: string;
  phonetic: string;
  example: string;
  tip: string;
}

export interface Lesson {
  id: number;
  title: string;
  titleEs: string;
  level: CEFRLevel;
  description: string;
  estimatedMinutes: number;
  phrases: Phrase[];
  grammar: GrammarNote;
  dialogue: DialogueLine[];
  pronunciationTips: PronunciationTip[];
  quiz: QuizQuestion[];
  speakingChallenge: string;
  vocabulary: { word: string; translation: string }[];
}

export type AppView =
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'lesson'
  | 'chat'
  | 'vocabulary'
  | 'progress';
