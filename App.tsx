import React, { useState, useEffect } from 'react';
import { UserProfile, AppState, DifficultyLevel, ReadingMaterial } from './types';
import { generateReadingMaterial } from './services/genAI';
import { ReadingView } from './components/ReadingView';
import { BreakGame } from './components/BreakGame';
import { Dashboard } from './components/Dashboard';
import { Rocket, Brain, Loader2 } from 'lucide-react';

const INITIAL_USER: UserProfile = {
  name: '',
  currentLevel: 1,
  xp: 0,
  streak: 1,
  readingHistory: []
};

export default function App() {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [appState, setAppState] = useState<AppState>(AppState.ONBOARDING);
  const [loading, setLoading] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<ReadingMaterial | null>(null);
  const [nameInput, setNameInput] = useState('');

  // Persist user partially (mock)
  useEffect(() => {
    const saved = localStorage.getItem('leo_user');
    if (saved) {
      setUser(JSON.parse(saved));
      setAppState(AppState.DASHBOARD);
    }
  }, []);

  useEffect(() => {
    if (user.name) {
      localStorage.setItem('leo_user', JSON.stringify(user));
    }
  }, [user]);

  const handleStartOnboarding = () => {
    if (nameInput.trim()) {
      setUser({ ...user, name: nameInput });
      setAppState(AppState.DASHBOARD);
    }
  };

  const startReadingSession = async (level: DifficultyLevel) => {
    setLoading(true);
    // Randomize topic based on simple list for now
    const topics = ["Superhéroes", "Espacio", "Dinosaurios", "Videojuegos", "Animales Marinos"];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    const material = await generateReadingMaterial(level, randomTopic);
    setCurrentMaterial(material);
    setLoading(false);
    setAppState(AppState.READING);
  };

  const handleLevelChange = (newLevel: DifficultyLevel) => {
      setUser(prev => ({ ...prev, currentLevel: newLevel }));
  };

  const handleReadingComplete = (wpm: number, accuracy: number) => {
    // Award XP
    const xpGained = Math.round((accuracy + wpm) / 2); // Simple formula
    
    setUser(prev => ({
        ...prev,
        xp: prev.xp + xpGained,
        readingHistory: [
            ...prev.readingHistory, 
            { date: new Date().toISOString(), wpm, accuracy, level: prev.currentLevel }
        ]
    }));

    // Check if we should suggest a break or return to dashboard
    // For this flow, let's go to Dashboard then maybe trigger break logic if session count is high
    setAppState(AppState.DASHBOARD);
  };

  const handleRequestBreak = () => {
      setAppState(AppState.BREAK_TIME);
  };

  const handleBreakFinish = () => {
      setAppState(AppState.DASHBOARD);
  };

  // Render Views
  if (appState === AppState.ONBOARDING) {
    return (
      <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border-b-8 border-blue-500">
            <div className="flex justify-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full">
                    <Rocket className="text-blue-600 w-16 h-16" />
                </div>
            </div>
            <h1 className="text-4xl font-black text-gray-800 mb-2">LeoAventuras</h1>
            <p className="text-gray-500 mb-8 text-lg">¡Aprender a leer es tu súper poder!</p>
            
            <div className="space-y-4">
                <label className="block text-left font-bold text-gray-700 ml-1">¿Cómo te llamas?</label>
                <input 
                    type="text" 
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Escribe tu nombre aquí..."
                    className="w-full text-xl p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleStartOnboarding()}
                />
                <button 
                    onClick={handleStartOnboarding}
                    disabled={!nameInput.trim()}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xl shadow-lg shadow-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transform transition active:scale-95"
                >
                    ¡Comenzar!
                </button>
            </div>
        </div>
      </div>
    );
  }

  if (loading) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
              <h2 className="text-2xl font-bold text-blue-700 animate-pulse">Creando tu aventura...</h2>
              <p className="text-blue-400">Nuestros robots están escribiendo una historia genial.</p>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-[#F0F9FF] pb-10">
        {/* Navbar-ish */}
        <div className="bg-white shadow-sm p-4 sticky top-0 z-50 mb-6">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setAppState(AppState.DASHBOARD)}>
                    <Rocket className="text-blue-600"/>
                    <span className="font-extrabold text-xl tracking-tight text-gray-800">LeoAventuras</span>
                </div>
                <div className="flex gap-4">
                   {appState !== AppState.BREAK_TIME && (
                     <button 
                        onClick={() => setAppState(AppState.BREAK_TIME)}
                        className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-purple-200 transition"
                     >
                         <Brain size={16} /> Descanso
                     </button>
                   )}
                </div>
            </div>
        </div>

        {/* Content Switcher */}
        {appState === AppState.DASHBOARD && (
            <Dashboard 
                user={user} 
                onSelectLevel={startReadingSession} 
                onChangeLevel={handleLevelChange} 
            />
        )}

        {appState === AppState.READING && currentMaterial && (
            <ReadingView 
                material={currentMaterial} 
                onComplete={handleReadingComplete}
                onRequestBreak={handleRequestBreak}
            />
        )}

        {appState === AppState.BREAK_TIME && (
            <div className="max-w-4xl mx-auto p-4 h-[80vh]">
                <BreakGame onFinishBreak={handleBreakFinish} />
            </div>
        )}
    </div>
  );
}
