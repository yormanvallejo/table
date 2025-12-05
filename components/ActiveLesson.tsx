import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LessonItem, ModelType } from '../types';
import { getTeacherFeedback } from '../services/geminiService';
import { LEVELS } from '../constants';

interface ActiveLessonProps {
  levelId: string;
  model: ModelType;
  onBack: () => void;
}

const ActiveLesson: React.FC<ActiveLessonProps> = ({ levelId, model, onBack }) => {
  const level = LEVELS.find(l => l.id === levelId);
  const items = level?.items || [];
  
  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [highlightKey, setHighlightKey] = useState<string | null>(null); // What specific part is highlighted
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [waitingForNext, setWaitingForNext] = useState(false); // Indicates ready for manual navigation

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);
  const sequenceIdRef = useRef(0);
  
  // Helpers
  const currentItem = items[currentIndex];

  const stopSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  // Start the automated reading process
  const startReadingSession = async () => {
    if (isReading) return;
    setIsReading(true);
    setIsSessionFinished(false);
    setWaitingForNext(false);
    setAudioBlob(null);
    setFeedback(null);
    chunksRef.current = [];
    setCurrentIndex(0); // Restart from beginning for the full session

    // Start Recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop()); // Stop mic
      };

      mediaRecorder.start();
      
      // The sequence will be triggered by the useEffect observing isReading/currentIndex

    } catch (err) {
      console.error("Microphone error", err);
      alert("Por favor habilita el micrófono para empezar.");
      setIsReading(false);
    }
  };

  const handleNext = () => {
    stopSpeech();
    setWaitingForNext(false);
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // If we are at the end and reading, finish the session
      if (isReading) finishSession();
    }
  };

  const handlePrev = () => {
    stopSpeech();
    setWaitingForNext(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // The core logic for sequencing text-to-speech
  const processSequence = useCallback(async () => {
    if (!currentItem) return;

    // Reset waiting state
    setWaitingForNext(false);

    // Increment sequence ID to invalidate previous running sequences
    sequenceIdRef.current++;
    const mySeqId = sequenceIdRef.current;

    const speak = (text: string, rate: number = 0.8) => {
      return new Promise<void>((resolve) => {
        if (mySeqId !== sequenceIdRef.current) { resolve(); return; }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = rate;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        synthRef.current.speak(utterance);
      });
    };

    const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

    // Wait a bit before starting speech
    await wait(500);
    if (mySeqId !== sequenceIdRef.current) return;

    // MODEL 1: Syllabic
    if (model === ModelType.SYLLABIC) {
      // 1. Read Syllables
      if (currentItem.syllables) {
        for (const syllable of currentItem.syllables) {
          if (mySeqId !== sequenceIdRef.current) return;
          setHighlightKey(syllable);
          await speak(syllable, 0.6); // Slower for syllables
          await wait(300);
        }
      }
      
      // 2. Read Full Word
      if (mySeqId !== sequenceIdRef.current) return;
      setHighlightKey('FULL');
      await speak(currentItem.text, 0.9);
      await wait(500); 
    } 
    
    // MODEL 2: Fluency
    else {
      if (mySeqId !== sequenceIdRef.current) return;
      setHighlightKey('FULL');
      // If it's a sentence, we can try to highlight words if available
      if (currentItem.type === 'sentence' && currentItem.words) {
         // Simply read full text for stability in fluency mode
         await speak(currentItem.text, 1);
      } else {
         await speak(currentItem.text, 1);
      }
      await wait(500);
    }

    if (mySeqId !== sequenceIdRef.current) return;

    // Move to next item or finish
    setHighlightKey(null);
    setWaitingForNext(true); // Indicate ready for manual navigation
    
    // NOTE: Auto-advance logic removed here to satisfy requirement
  }, [currentIndex, currentItem, model]);

  // Effect to trigger next step in sequence when index changes
  useEffect(() => {
    if (isReading && !isSessionFinished) {
      processSequence();
    }
    // Cleanup if component unmounts or index changes rapidly
    return () => {
      if (isReading) stopSpeech();
    };
  }, [currentIndex, isReading, isSessionFinished, processSequence]); 

  const finishSession = () => {
    setIsReading(false);
    setIsSessionFinished(true);
    setWaitingForNext(false);
    stopSpeech();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleAIRequest = async () => {
    if (!audioBlob) return;
    setIsLoadingFeedback(true);
    // Combine all text from the lesson for context
    const fullText = items.map(i => i.text).join(', ');
    const response = await getTeacherFeedback(audioBlob, fullText);
    setFeedback(response);
    setIsLoadingFeedback(false);
    
    // Speak the feedback too!
    const utterance = new SpeechSynthesisUtterance(response);
    utterance.lang = 'es-ES';
    synthRef.current.speak(utterance);
  };

  // Render Helpers
  const renderContent = () => {
    if (!currentItem) return null;

    // Render Logic based on Model and Type
    if (model === ModelType.SYLLABIC && currentItem.syllables) {
      return (
        <div className="flex gap-2 items-center justify-center text-7xl font-bold text-gray-800 flex-wrap">
          {currentItem.syllables.map((syl, idx) => (
            <span 
              key={idx}
              className={`px-2 transition-all duration-300 ${
                highlightKey === syl || highlightKey === 'FULL' 
                  ? 'text-kid-pink scale-110' 
                  : 'text-gray-400'
              }`}
            >
              {syl}
            </span>
          ))}
        </div>
      );
    }
    
    if (model === ModelType.FLUENCY && currentItem.type === 'sentence' && currentItem.words) {
       return (
        <div className="flex flex-wrap gap-4 items-center justify-center text-5xl font-bold text-gray-800 max-w-2xl text-center leading-relaxed">
          {currentItem.words.map((word, idx) => (
             <span
               key={idx}
               className={`transition-all duration-200 ${
                 highlightKey === word || highlightKey === 'FULL'
                   ? 'text-kid-purple bg-yellow-200 rounded-lg px-2'
                   : ''
               }`}
             >
               {word}
             </span>
          ))}
        </div>
       )
    }

    // Default Fallback
    return (
      <div className={`text-7xl font-bold transition-all duration-300 text-center ${highlightKey === 'FULL' ? 'text-kid-purple scale-110' : 'text-gray-800'}`}>
        {currentItem.text}
      </div>
    );
  };

  // Calculate if next button should be prominent
  const isLastItem = currentIndex === items.length - 1;

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-2xl overflow-hidden relative">
      {/* Header */}
      <div className={`p-4 flex items-center justify-between ${level?.color || 'bg-gray-200'}`}>
        <button onClick={onBack} className="bg-white/30 hover:bg-white/50 p-2 rounded-full text-white font-bold text-xl px-4">
          ← Salir
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center flex-1 drop-shadow-md truncate">
          {level?.title}
        </h2>
        <div className="w-16"></div> {/* Spacer */}
      </div>

      {/* Main Stage */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gray-100 z-10">
           <div 
             className="h-full bg-green-400 transition-all duration-500"
             style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
           />
        </div>

        <div className="flex-1 flex items-center justify-between p-2 md:p-8">
          
          {/* Previous Button */}
          <button 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
            className={`p-4 rounded-full text-4xl shadow-md transition-all z-20
              ${currentIndex === 0 
                ? 'opacity-20 cursor-not-allowed bg-gray-100 text-gray-300' 
                : 'bg-white text-kid-blue hover:bg-blue-50 hover:scale-110'
              }`}
          >
            ⬅️
          </button>

          {/* Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-0">
            {/* Image Display */}
            {currentItem?.image && (
              <div className="mb-4 md:mb-8 p-2 bg-white rounded-xl shadow-lg border-4 border-dashed border-gray-200 transform rotate-1 max-h-[30vh] md:max-h-[40vh] w-auto aspect-square flex items-center justify-center overflow-hidden">
                 <img src={currentItem.image} alt={currentItem.text} className="max-h-full max-w-full object-contain rounded-lg" />
              </div>
            )}

            {/* Text Display */}
            <div className="min-h-[100px] flex items-center justify-center p-4">
              {renderContent()}
            </div>
            
            {/* Instruction Cue */}
            {waitingForNext && isReading && (
                <div className="mt-4 animate-bounce text-kid-green font-bold text-xl">
                    ¡Toca la flecha para seguir! 👉
                </div>
            )}
          </div>

          {/* Next Button */}
          <button 
            onClick={handleNext} 
            disabled={isLastItem && !isReading}
            className={`p-4 rounded-full text-4xl shadow-md transition-all z-20 border-4
              ${waitingForNext 
                 ? 'border-kid-green bg-green-50 scale-110 shadow-xl animate-pulse ring-4 ring-green-200' 
                 : 'border-transparent' 
              }
              ${isLastItem && !isReading
                ? 'opacity-20 cursor-not-allowed bg-gray-100 text-gray-300' 
                : 'bg-white text-kid-blue hover:bg-blue-50 hover:scale-110'
              }`}
          >
            {isLastItem && isReading ? '🏁' : '➡️'}
          </button>

        </div>

      </div>

      {/* Controls */}
      <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col items-center gap-4 z-20">
        
        {!isReading && !isSessionFinished && (
           <button 
             onClick={startReadingSession}
             className="bg-kid-green hover:bg-green-400 text-white text-2xl md:text-3xl font-bold py-4 px-12 rounded-full shadow-[0_6px_0_0_rgba(6,180,140,1)] active:shadow-none active:translate-y-1 transition-all flex items-center gap-3"
           >
             <span>▶️</span> ¡Empezar Lección!
           </button>
        )}

        {isReading && (
           <div className="flex flex-col items-center">
             <div className="flex items-center gap-2 mb-1 animate-pulse">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <p className="text-sm text-gray-400 font-bold tracking-wider uppercase">Grabando</p>
             </div>
             <p className="text-xl text-gray-500 font-bold">
               {waitingForNext ? '¡Ahora tú! (Luego siguiente)' : 'Escucha con atención...'}
             </p>
             <button onClick={finishSession} className="mt-2 text-xs text-red-400 underline hover:text-red-600">Detener todo</button>
           </div>
        )}

        {isSessionFinished && (
          <div className="w-full flex flex-col items-center gap-4">
            <h3 className="text-2xl font-bold text-kid-blue">¡Terminaste! 🎉</h3>
            
            {audioBlob && (
              <div className="flex flex-col items-center gap-2 w-full max-w-md">
                <p className="text-gray-600">Escúchate a ti mismo:</p>
                <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
              </div>
            )}

            {!feedback ? (
              <button 
                onClick={handleAIRequest}
                disabled={isLoadingFeedback}
                className="bg-kid-purple hover:bg-purple-600 text-white text-xl font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-2 transition-all"
              >
                 {isLoadingFeedback ? 'Pensando...' : '✨ ¿Qué dice el Profe Mágico?'}
              </button>
            ) : (
              <div className="bg-yellow-50 border-2 border-kid-yellow p-4 rounded-xl max-w-md text-center">
                <p className="text-lg font-bold text-gray-700">🤖 El Profe Mágico dice:</p>
                <p className="text-xl text-kid-pink mt-2 font-comic italic">"{feedback}"</p>
              </div>
            )}

            <button 
              onClick={() => {
                setCurrentIndex(0);
                setIsSessionFinished(false);
                setAudioBlob(null);
                setFeedback(null);
              }}
              className="text-gray-400 underline mt-4 hover:text-gray-600"
            >
              Intentar de nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveLesson;