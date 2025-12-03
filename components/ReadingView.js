import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, RefreshCw, CheckCircle, Volume2 } from 'lucide-react';
import { evaluateReadingSession } from '../services/genAI.js';

export const ReadingView = ({ material, onComplete, onRequestBreak }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const { webkitSpeechRecognition, SpeechRecognition } = window;
    const SpeechRecognitionAPI = SpeechRecognition || webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(prev => prev + finalTranscript + interimTranscript);
      };
      
      recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event.error);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      // Stop
      if (recognitionRef.current) recognitionRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRecording(false);
      analyzeReading();
    } else {
      // Start
      setTranscript('');
      setTimeElapsed(0);
      setFeedback(null);
      if (recognitionRef.current) {
        try {
            recognitionRef.current.start();
        } catch(e) {
            console.warn("Already started", e);
        }
      }
      
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      setIsRecording(true);
    }
  };

  const analyzeReading = async () => {
    setAnalyzing(true);
    // Rough local calculation first
    const words = material.content.split(' ').length;
    const minutes = timeElapsed / 60;
    const roughWPM = minutes > 0 ? Math.round(words / minutes) : 0;

    // Call Gemini for better analysis
    const result = await evaluateReadingSession(material.content, transcript, timeElapsed);
    
    setFeedback({
      msg: result.feedback,
      wpm: result.wpm || roughWPM
    });
    setAnalyzing(false);
    setShowQuiz(true);
  };

  const handleQuizAnswer = (qIndex, aIndex) => {
      if (material.questions[qIndex].correctIndex === aIndex) {
          setQuizScore(prev => prev + 1);
      }
  };

  const finishSession = () => {
      // Logic: If quiz score is high, high accuracy.
      const calculatedAccuracy = showQuiz ? (quizScore / material.questions.length) * 100 : 80;
      onComplete(feedback?.wpm || 0, calculatedAccuracy);
  };

  if (showQuiz) {
      return (
          <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-xl">
              <h2 className="text-2xl font-bold text-purple-600 mb-4">¡Preguntas Rápidas!</h2>
              <div className="space-y-6">
                  {material.questions.map((q, idx) => (
                      <div key={idx} className="bg-purple-50 p-4 rounded-xl">
                          <p className="font-bold text-lg mb-3">{q.question}</p>
                          <div className="grid grid-cols-1 gap-2">
                              {q.options.map((opt, optIdx) => (
                                  <button
                                    key={optIdx}
                                    onClick={(e) => {
                                        handleQuizAnswer(idx, optIdx);
                                        // Visual feedback hack
                                        e.target.disabled = true;
                                        if (optIdx === q.correctIndex) {
                                            e.target.classList.add('bg-green-200');
                                        } else {
                                            e.target.classList.add('bg-red-200');
                                        }
                                    }}
                                    className="p-3 text-left bg-white border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition"
                                  >
                                      {opt}
                                  </button>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
              <div className="mt-8 flex justify-center">
                  <button 
                    onClick={finishSession}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg transform transition hover:scale-105 flex items-center gap-2"
                  >
                      <CheckCircle /> ¡Terminar Nivel!
                  </button>
              </div>
          </div>
      )
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
      
      {/* Header/Title */}
      <div className="w-full bg-white p-6 rounded-3xl shadow-lg border-b-4 border-blue-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Volume2 size={120} />
        </div>
        <h2 className="text-3xl font-extrabold text-blue-600 mb-2">{material.title}</h2>
        <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
            {material.theme}
        </span>
      </div>

      {/* Main Content */}
      <div className="w-full bg-amber-50 p-8 rounded-3xl shadow-inner border-4 border-amber-200 min-h-[300px] flex items-center justify-center relative">
        <p className="text-2xl md:text-3xl leading-relaxed font-medium text-gray-800 text-center font-sans">
          {material.content}
        </p>
        {isRecording && (
             <div className="absolute bottom-4 right-4 animate-pulse">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Grabando
                </span>
            </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex gap-6 items-center">
            {!isRecording && !analyzing && (
                <button
                    onClick={toggleRecording}
                    className="group relative flex items-center justify-center w-20 h-20 bg-green-500 rounded-full shadow-green-400 shadow-xl transform transition hover:scale-110 active:scale-95"
                >
                    <Mic className="text-white w-10 h-10" />
                    <span className="absolute -bottom-8 text-green-700 font-bold whitespace-nowrap">Leer</span>
                </button>
            )}

            {isRecording && (
                <button
                    onClick={toggleRecording}
                    className="flex items-center justify-center w-20 h-20 bg-red-500 rounded-full shadow-red-400 shadow-xl transform transition hover:scale-110 active:scale-95"
                >
                    <Square className="text-white w-8 h-8 fill-current" />
                </button>
            )}
          </div>

          {analyzing && (
              <div className="flex flex-col items-center text-purple-600">
                  <RefreshCw className="animate-spin w-10 h-10 mb-2" />
                  <p className="font-bold">El mago está escuchando tu lectura...</p>
              </div>
          )}

          {/* Timer Visual for ADHD */}
          {isRecording && (
              <div className="text-4xl font-mono font-bold text-gray-400 mt-4">
                  {Math.floor(timeElapsed / 60).toString().padStart(2, '0')}:{(timeElapsed % 60).toString().padStart(2, '0')}
              </div>
          )}
      </div>

      <button onClick={onRequestBreak} className="mt-8 text-gray-400 hover:text-gray-600 underline text-sm">
          Necesito un descanso ahora
      </button>
    </div>
  );
};