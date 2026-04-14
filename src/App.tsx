import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Lesson from './pages/Lesson';
import Chat from './pages/Chat';
import Vocabulary from './pages/Vocabulary';
import Progress from './pages/Progress';
import { AppView } from './types';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('landing');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-300 rounded-lg mb-4"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    if (currentView === 'landing') {
      return <Landing onNavigate={setCurrentView} />;
    }
    return <Auth onNavigate={setCurrentView} />;
  }

  return (
    <>
      <Navbar currentView={currentView} onNavigate={setCurrentView} />
      <div>
        {currentView === 'dashboard' && <Dashboard onNavigate={setCurrentView} />}
        {currentView === 'lesson' && <Lesson />}
        {currentView === 'chat' && <Chat />}
        {currentView === 'vocabulary' && <Vocabulary />}
        {currentView === 'progress' && <Progress />}
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
