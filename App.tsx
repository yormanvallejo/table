import React, { useState } from 'react';
import { LEVELS } from './constants';
import { ModelType } from './types';
import ActiveLesson from './components/ActiveLesson';

function App() {
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.SYLLABIC);

  // If a lesson is active, show the player
  if (selectedLevelId) {
    return (
      <div className="h-screen w-full p-2 md:p-6 bg-blue-50">
        <ActiveLesson 
          levelId={selectedLevelId} 
          model={selectedModel}
          onBack={() => setSelectedLevelId(null)} 
        />
      </div>
    );
  }

  // Otherwise, show the Dashboard/Menu
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 font-sans">
      <header className="text-center mb-10 pt-4">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-kid-blue to-kid-pink drop-shadow-sm mb-2">
          Aprende a Leer
        </h1>
        <p className="text-gray-500 text-xl">¡Diviértete leyendo con la ayuda de la IA!</p>
      </header>

      <main className="max-w-4xl mx-auto">
        
        {/* Model Selector Switch */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1 rounded-full shadow-md flex">
            <button
              onClick={() => setSelectedModel(ModelType.SYLLABIC)}
              className={`px-6 py-2 rounded-full text-lg font-bold transition-all ${
                selectedModel === ModelType.SYLLABIC 
                  ? 'bg-kid-yellow text-gray-800 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              🐢 Modo Silábico
            </button>
            <button
              onClick={() => setSelectedModel(ModelType.FLUENCY)}
              className={`px-6 py-2 rounded-full text-lg font-bold transition-all ${
                selectedModel === ModelType.FLUENCY 
                  ? 'bg-kid-green text-white shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              🐇 Modo Fluidez
            </button>
          </div>
        </div>

        {/* Level Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedLevelId(level.id)}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden text-left"
            >
              <div className={`h-32 ${level.color} flex items-center justify-center`}>
                <span className="text-6xl group-hover:scale-125 transition-transform duration-300">
                  {level.id === 'level-1' ? '🅰️' : level.id === 'level-2' ? '🗣️' : '📝'}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{level.title}</h3>
                <p className="text-gray-500 text-sm">{level.description}</p>
                <div className="mt-4 flex justify-end">
                   <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                     Entrar
                   </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      <footer className="text-center mt-16 text-gray-400 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
}

export default App;