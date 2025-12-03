import React from 'react';
import { Star, PlayCircle, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const Dashboard = ({ user, onSelectLevel, onChangeLevel }) => {
  const levels = [
    { level: 1, name: "Explorador de Palabras", desc: "Sílabas y palabras sueltas" },
    { level: 2, name: "Constructor de Frases", desc: "Oraciones cortas y divertidas" },
    { level: 3, name: "Pequeño Lector", desc: "Párrafos simples" },
    { level: 4, name: "Aventurero de Historias", desc: "Cuentos cortos" },
    { level: 5, name: "Maestro de la Lectura", desc: "Texto corrido y fluido" },
  ];

  const chartData = user.readingHistory.slice(-5).map((log, i) => ({
      name: `Sesión ${i + 1}`,
      wpm: log.wpm
  }));

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center">
        <div>
            <h1 className="text-4xl font-extrabold mb-2">¡Hola, {user.name}!</h1>
            <p className="text-blue-100 text-lg">Estás en racha: {user.streak} días 🔥</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-sm">
            <Star className="text-yellow-300 w-8 h-8 mr-2 fill-current" />
            <span className="text-3xl font-bold">{user.xp} XP</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Level Map */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu Mapa de Aventura</h2>
            <div className="grid gap-4">
                {levels.map((lvl) => {
                    const isCurrent = lvl.level === user.currentLevel;
                    
                    return (
                        <div 
                            key={lvl.level}
                            className={`relative p-4 rounded-2xl border-b-4 transition-all duration-200 flex items-center justify-between
                                ${isCurrent ? 'bg-white border-blue-400 shadow-lg scale-105 z-10' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-white'}
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl
                                    ${isCurrent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}
                                `}>
                                    {lvl.level}
                                </div>
                                <div>
                                    <h3 className={`font-bold text-lg ${isCurrent ? 'text-blue-700' : ''}`}>{lvl.name}</h3>
                                    <p className="text-sm">{lvl.desc}</p>
                                </div>
                            </div>

                            {isCurrent ? (
                                <button 
                                    onClick={() => onSelectLevel(lvl.level)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-md flex items-center gap-2"
                                >
                                    <PlayCircle size={20}/> Jugar
                                </button>
                            ) : (
                                <button 
                                    onClick={() => onChangeLevel(lvl.level)}
                                    className="text-blue-400 font-semibold text-sm hover:underline"
                                >
                                    Cambiar aquí
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 h-fit">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart2 className="text-purple-500"/> Tu Evolución
              </h2>
              <div className="h-48 w-full">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <XAxis dataKey="name" hide />
                            <YAxis hide />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Line type="monotone" dataKey="wpm" stroke="#8884d8" strokeWidth={3} dot={{r: 4}} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-center text-sm">
                        Completa lecciones para ver tu velocidad aquí.
                    </div>
                )}
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">Velocidad de lectura (palabras/min)</p>
          </div>
      </div>
    </div>
  );
};