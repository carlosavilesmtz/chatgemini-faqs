
import { GoogleGenAI, FunctionDeclaration, Type, Part } from "@google/genai";
import type { Message, ChatConfig } from '../types';

// ==================================================================================
// NOTA IMPORTANTE SOBRE LA API KEY DE GEMINI
// ==================================================================================
// La clave API no se escribe directamente aquí en el código. 
// Por seguridad, se lee desde una "variable de entorno" llamada API_KEY.
// Debes configurar esta variable en el sistema donde ejecutas la aplicación.
// El siguiente código busca esa variable y la utiliza para conectarse a la API.
// ==================================================================================

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getCalendarEventsFunctionDeclaration: FunctionDeclaration = {
    name: 'get_calendar_events',
    parameters: {
      type: Type.OBJECT,
      description: 'Obtiene una lista de eventos del calendario del usuario para un rango de fechas específico.',
      properties: {
        startDate: {
          type: Type.STRING,
          description: 'La fecha de inicio para buscar eventos, en formato ISO 8601 (YYYY-MM-DDTHH:mm:ssZ).',
        },
        endDate: {
          type: Type.STRING,
          description: 'La fecha de finalización para buscar eventos, en formato ISO 8601 (YYYY-MM-DDTHH:mm:ssZ).',
        },
      },
      required: ['startDate', 'endDate'],
    },
};


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
    ? `Usa el siguiente contexto para responder las preguntas del usuario. Si la respuesta no está en el contexto, indica amablemente que no tienes esa información.

--- CONTEXTO DEL NEGOCIO ---
${context.trim()}
--- FIN DEL CONTEXTO ---`
    : 'Responde a las preguntas del usuario de la mejor manera posible.';

  const calendarInstruction = config.googleCalendarIntegration
    ? "\nTambién tienes la capacidad de consultar el calendario del usuario para responder a preguntas sobre su agenda utilizando las herramientas disponibles. Informa al usuario que esta es una demostración y los eventos son de ejemplo."
    : "";

  return `${config.personality}
${finalContext}
${calendarInstruction}
Responde en español.`;
};


export const getChatResponse = async (
  newMessage: string,
  history: Message[],
  config: ChatConfig
): Promise<string> => {
  try {
    const geminiModel = config.model;
    const fullHistory = buildGeminiHistory(history);
    const contents = [
      ...fullHistory,
      { role: 'user', parts: [{ text: newMessage }] }
    ];

    const systemInstruction = buildSystemInstruction(config);
    
    const tools = config.googleCalendarIntegration ? [{ functionDeclarations: [getCalendarEventsFunctionDeclaration] }] : undefined;

    // FIX: The 'tools' property must be passed inside the 'config' object for the generateContent call.
    const firstResponse = await ai.models.generateContent({
        model: geminiModel,
        contents,
        config: {
            systemInstruction,
            maxOutputTokens: config.maxTokens,
            thinkingConfig: { thinkingBudget: 50 },
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            tools,
        },
    });

    const functionCalls = firstResponse.functionCalls;
    if (!functionCalls || functionCalls.length === 0) {
      return firstResponse.text;
    }
    
    // In a real app, you would execute the function. Here we simulate it.
    const functionCall = functionCalls[0];
    if (functionCall.name === 'get_calendar_events') {
        const simulatedApiResponse = {
            events: [
                { summary: 'Reunión de equipo', start: '2024-08-10T10:00:00Z', end: '2024-08-10T11:00:00Z' },
                { summary: 'Llamada con Cliente X', start: '2024-08-10T14:30:00Z', end: '2024-08-10T15:00:00Z' },
                { summary: 'Cita con el dentista', start: '2024-08-11T09:00:00Z', end: '2024-08-11T09:30:00Z' },
            ]
        };

        const functionResponsePart: Part = {
            functionResponse: {
                name: 'get_calendar_events',
                response: simulatedApiResponse,
            }
        };

        // Send the function response back to the model
        const secondResponse = await ai.models.generateContent({
            model: geminiModel,
            contents: [...contents, { role: 'model', parts: [{ functionCall }] }, { role: 'function', parts: [functionResponsePart] }],
             config: {
                systemInstruction,
                maxOutputTokens: config.maxTokens,
            },
        });
        
        return secondResponse.text;
    }

    return "Se ha producido un error al llamar a la función.";

  } catch (error) {
    console.error("Error getting chat response:", error);
    return "Lo siento, ocurrió un error al procesar tu solicitud. Por favor, revisa la configuración o intenta de nuevo más tarde.";
  }
};