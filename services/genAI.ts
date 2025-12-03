import { GoogleGenAI, Type } from "@google/genai";
import { DifficultyLevel, ReadingMaterial } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `Eres un experto pedagogo especializado en TDAH. 
Tu objetivo es crear contenido de lectura motivador, corto y estructurado para un niño de 10 años.
Usa lenguaje positivo, temas fascinantes (espacio, animales, videojuegos, superhéroes) y frases claras.
Evita párrafos densos.`;

export const generateReadingMaterial = async (level: DifficultyLevel, interests: string = "general"): Promise<ReadingMaterial> => {
  const levelPrompts = {
    1: "Nivel muy básico: Palabras simples, sílabas claras, frases de máximo 3 palabras.",
    2: "Nivel básico: Frases cortas y directas. Vocabulario cotidiano.",
    3: "Nivel intermedio: Párrafos cortos (3-4 líneas). Historias con inicio y fin simple.",
    4: "Nivel avanzado: Historias con diálogo simple y descripciones moderadas.",
    5: "Nivel experto: Lectura fluida, textos informativos o narrativos completos adecuados para 10 años."
  };

  const prompt = `Genera un ejercicio de lectura.
  Nivel: ${level} (${levelPrompts[level]}).
  Tema sugerido: ${interests}.
  
  Devuelve un JSON con:
  - title: Título divertido.
  - content: El texto a leer.
  - theme: El tema principal.
  - questions: Array de 2 preguntas de comprensión sencillas con 3 opciones y el índice de la correcta.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            theme: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ReadingMaterial;
    }
    throw new Error("No text returned from Gemini");
  } catch (error) {
    console.error("Error generating content:", error);
    // Fallback content in case of error
    return {
      id: "fallback-1",
      title: "El Perro Veloz",
      content: "El perro corre mucho. Le gusta la pelota. Salta muy alto.",
      theme: "Animales",
      questions: [
        {
          question: "¿Qué hace el perro?",
          options: ["Duerme", "Corre mucho", "Come"],
          correctIndex: 1
        },
        {
            question: "¿Qué le gusta?",
            options: ["La pelota", "El gato", "La lluvia"],
            correctIndex: 0
        }
      ]
    };
  }
};

export const evaluateReadingSession = async (originalText: string, transcript: string, durationSeconds: number) => {
  // Use Gemini to analyze the reading if transcript is available, 
  // otherwise we calculate basic metrics locally in the component.
  // This function is for qualitative feedback.
  
  try {
    const prompt = `Texto original: "${originalText}"
    Texto leído por el niño (transcrito): "${transcript}"
    Duración: ${durationSeconds} segundos.
    
    Evalúa:
    1. Precisión (aproximada).
    2. Velocidad (¿Es adecuada para un niño de 10 años?).
    3. Mensaje motivacional corto (1 frase).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
         responseSchema: {
          type: Type.OBJECT,
          properties: {
            accuracyScore: { type: Type.NUMBER, description: "0 to 100" },
            feedback: { type: Type.STRING },
            wpm: { type: Type.NUMBER }
          }
        }
      }
    });
     if (response.text) {
      return JSON.parse(response.text);
    }
    return { accuracyScore: 80, feedback: "¡Buen esfuerzo!", wpm: 0 };
  } catch (e) {
    return { accuracyScore: 0, feedback: "Error analizando.", wpm: 0 };
  }
}
