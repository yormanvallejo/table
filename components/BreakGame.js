import React, { useState, useEffect, useRef } from 'react';
import { Target, Trophy } from 'lucide-react';

export const BreakGame = ({ onFinishBreak }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 seconds
  const [score, setScore] = useState(0);
  const [targetPos, setTargetPos] = useState({ top: '50%', left: '50%' });
  const [gameActive, setGameActive] = useState(false);
  
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const moveTarget = () => {
      if (!containerRef.current) return;
      // Keep it within 10% - 90% to avoid edges
      const newTop = Math.random() * 80 + 10;
      const newLeft = Math.random() * 80 + 10;
      setTargetPos({ top: `${newTop}%`, left: `${newLeft}%` });
  };

  const handleTargetClick = () => {
      setScore(s => s + 10);
      moveTarget();
  };

  const startGame = () => {
      setGameActive(true);
      moveTarget();
  };

  const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-900 text-white rounded-3xl p-6 relative overflow-hidden">
        
        {/* Top Bar */}
        <div className="absolute top-4 w-full flex justify-between px-8 z-20">
            <div className="flex items-center gap-2">
                <Trophy className="text-yellow-400" />
                <span className="font-bold text-xl">{score} pts</span>
            </div>
            <div className="font-mono text-xl bg-indigo-800 px-3 py-1 rounded-lg">
                Descanso: {formatTime(timeLeft)}
            </div>
        </div>

        {/* Game Area */}
        <div 
            ref={containerRef}
            className="w-full max-w-2xl h-96 bg-indigo-800 rounded-2xl relative shadow-inner border-4 border-indigo-700 overflow-hidden cursor-crosshair"
        >
            {!gameActive ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40 backdrop-blur-sm">
                    <h3 className="text-3xl font-bold mb-4 text-center">Atrapa la Burbuja</h3>
                    <p className="mb-6 text-indigo-200">Mejora tu concentración atrapando los objetivos.</p>
                    <button 
                        onClick={startGame}
                        className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
                    >
                        JUGAR
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleTargetClick}
                    style={{ top: targetPos.top, left: targetPos.left }}
                    className="absolute w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none transition-all duration-300 ease-out"
                >
                     <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 rounded-full shadow-lg animate-pulse border-4 border-white flex items-center justify-center">
                        <Target className="w-8 h-8 text-white" />
                     </div>
                </button>
            )}
        </div>

        <div className="mt-8 text-center z-20">
            <p className="text-indigo-300 mb-4 text-sm">El botón para volver aparecerá pronto...</p>
            {/* Allow skip if necessary or after a minimal time */}
            <button 
                onClick={onFinishBreak}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg text-sm transition"
            >
                Saltar descanso (Volver a Leer)
            </button>
        </div>
        
        {/* Decorative Background Elements */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
    </div>
  );
};