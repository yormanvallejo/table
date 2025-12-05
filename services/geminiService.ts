import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// NOTE: Process.env.API_KEY is assumed to be available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a Blob to a Base64 string suitable for Gemini API.
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:audio/webm;base64,")
      const base64 = dataUrl.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Sends the child's audio recording to Gemini for encouragement.
 */
export const getTeacherFeedback = async (audioBlob: Blob, textRead: string): Promise<string> => {
  try {
    const base64Audio = await blobToBase64(audioBlob);

    const model = 'gemini-2.5-flash'; 

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            text: `Eres un maestro de preescolar muy amable y entusiasta. 
            Un niño acaba de leer lo siguiente: "${textRead}".
            Escucha su grabación. Responde SOLO en español.
            Tu respuesta debe ser muy corta (máximo 2 frases), muy motivadora y felicitarlo por su esfuerzo.
            Si no se escucha nada, diles amablemente que intenten de nuevo.`
          },
          {
            inlineData: {
              mimeType: audioBlob.type || 'audio/webm',
              data: base64Audio
            }
          }
        ]
      }
    });

    return response.text || "¡Muy buen intento! ¡Sigue así!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "¡Eres increíble! ¡Sigue practicando!";
  }
};
