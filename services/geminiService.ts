
import { GoogleGenAI, Part, UsageMetadata } from "@google/genai";
import type { Message, ChatConfig } from '../types';

// ==================================================================================
// NOTA IMPORTANTE SOBRE LA API KEY DE GEMINI
// ==================================================================================
// La clave API se lee de forma segura desde una variable de entorno VITE_GEMINI_API_KEY.
// ==================================================================================

// Ensure the API key is available from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

// FIX: Corrected the function signature and implementation to return an array of Content objects (`{ role, parts }`), which is the expected format for chat history. This resolves multiple downstream TypeScript errors.
const buildGeminiHistory = (messages: Message[]): { role: "user" | "model"; parts: Part[] }[] => {
  return messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));
};


const buildSystemInstruction = (config: ChatConfig): string => {
  const faqContext = config.faqs
    .filter(faq => faq.question && faq.answer)
    .map(faq => `P: ${faq.question}\nR: ${faq.answer}`)
    .join('\n\n');

  let context = '';
  if (config.companyInfo) {
    context += `Información de la Empresa:\n${config.companyInfo}\n\n`;
  }
  if (config.productsInfo) {
    context += `Productos y Servicios:\n${config.productsInfo}\n\n`;
  }
  if (config.promotionsInfo) {
    context += `Promociones Actuales:\n${config.promotionsInfo}\n\n`;
  }
  if (faqContext) {
    context += `Preguntas Frecuentes (FAQs):\n${faqContext}\n\n`;
  }

  const finalContext = context.trim()
    ? `Usa el siguiente contexto para responder las preguntas del usuario. Si la respuesta no está en el contexto, indica amablemente que no tienes esa información.\n\n--- CONTEXTO DEL NEGOCIO ---\n${context.trim()}\n--- FIN DEL CONTEXTO ---`
    : 'Responde a las preguntas del usuario de la mejor manera posible.';

  return `${config.personality}\n${finalContext}\nResponde en español.`;
};


export const getChatResponse = async (
  newMessage: string,
  history: Message[],
  config: ChatConfig
): Promise<{ text: string; usageMetadata?: UsageMetadata }> => {
  try {
    const geminiModel = config.model;
    const fullHistory = buildGeminiHistory(history);
    const contents = [
      ...fullHistory,
      { role: 'user', parts: [{ text: newMessage }] }
    ];

    const systemInstruction = buildSystemInstruction(config);

    const response = await ai.models.generateContent({
        model: geminiModel,
        contents,
        config: {
            systemInstruction,
            maxOutputTokens: config.maxTokens,
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
        },
    });

    return { text: response.text, usageMetadata: response.usageMetadata };

  } catch (error) {
    console.error("Error getting chat response:", error);
    return {
        text: "Lo siento, ocurrió un error al procesar tu solicitud. Por favor, revisa la configuración o intenta de nuevo más tarde.",
        usageMetadata: undefined
    };
  }
};

export const enhancePrompt = async (text: string, contextType: string): Promise<string> => {
    if (!text.trim()) return text;

    const metaPrompt = `\nEres un asistente de IA especializado en ingeniería de prompts. Tu tarea es refinar el siguiente texto proporcionado por un usuario para que sirva como una instrucción clara, estructurada y efectiva para otro asistente de IA.\n\n**Reglas Críticas:**\n1.  **NO añadas, inventes o elimines información factual.** El significado original y los datos deben preservarse por completo.\n2.  **Reformula el texto** para que sea una instrucción directa o una pieza de conocimiento contextual para un chatbot.\n3.  **Mejora el formato** utilizando markdown (como listas con guiones o asteriscos, y texto en negrita con **) para aumentar la claridad. No uses encabezados (#).\n4.  La respuesta debe ser únicamente el texto refinado, sin explicaciones adicionales.\n5.  El resultado debe estar en español.\n\n**Contexto del texto:** ${contextType}\n\n**Texto del Usuario a Refinar:**\n\`\`\`\n${text}\n\`\`\`\n\n**Texto Refinado:**\n    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: metaPrompt,
        });
        const enhancedText = response.text.trim();
        return enhancedText || text; // Return original text if enhancement fails
    } catch (error) {
        console.error("Error enhancing prompt:", error);
        return text; // Return original text on error
    }
};
