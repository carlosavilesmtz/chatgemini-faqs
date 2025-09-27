
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
    const systemInstruction = buildSystemInstruction(config);

    // Define la herramienta de Google Calendar
    const calendarTool = {
      functionDeclarations: [
        {
          name: 'check_calendar_availability',
          description: 'Consulta la agenda de Google Calendar para verificar si hay horarios disponibles o si un horario específico está ocupado.',
          parameters: {
            type: 'OBJECT',
            properties: {
              startTime: { type: 'STRING', description: 'Fecha y hora de inicio en formato ISO 8601' },
              endTime: { type: 'STRING', description: 'Fecha y hora de fin en formato ISO 8601' },
            },
            required: ['startTime', 'endTime'],
          },
        },
      ],
    };

    const model = ai.getGenerativeModel({
        model: geminiModel,
        systemInstruction,
        tools: config.googleCalendar.isConnected ? [calendarTool] : undefined,
    });

    const chat = model.startChat({ history: fullHistory });
    const result = await chat.sendMessage(newMessage);
    const response = result.response;

    const functionCall = response.functionCalls()?.[0];

    if (functionCall && functionCall.name === 'check_calendar_availability') {
        const { startTime, endTime } = functionCall.args;
        console.log('Gemini wants to check calendar:', { startTime, endTime });

        // Llamada al backend para consultar la disponibilidad
        const apiResponse = await fetch('http://localhost:4000/api/calendar/free-busy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ startTime, endTime }),
        });

        if (!apiResponse.ok) {
            throw new Error(`API Error: ${apiResponse.statusText}`);
        }

        const busyIntervals = await apiResponse.json();

        // Enviar el resultado de la herramienta de vuelta a Gemini
        const toolResult = await chat.sendMessage([
            {
                functionResponse: {
                    name: 'check_calendar_availability',
                    response: { busy: busyIntervals },
                },
            },
        ]);
        
        // Devolver la respuesta final del modelo
        return { text: toolResult.response.text(), usageMetadata: response.usageMetadata };
    }

    // Si no hay function call, devolver la respuesta de texto directamente
    return { text: response.text(), usageMetadata: response.usageMetadata };

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

export const processUrlForKnowledge = async (url: string): Promise<{ companyInfo: string; productsInfo: string; promotionsInfo: string; }> => {
    console.log(`Fetching content from: ${url}`);
    // This is a placeholder for the web_fetch tool call
    const webContent = await Promise.resolve("Contenido de la web simulado"); // Replace with actual web_fetch call

    const prompt = `\n    Eres un asistente de IA experto en análisis y estructuración de contenido. A continuación, se te proporciona el texto extraído de un sitio web. Tu tarea es leerlo y clasificar la información en las siguientes categorías: 'companyInfo', 'productsInfo', 'promotionsInfo'.\n\n    - En 'companyInfo', resume quién es la empresa, su misión o historia.\n    - En 'productsInfo', describe los productos o servicios que ofrece.\n    - En 'promotionsInfo', extrae cualquier promoción, oferta o descuento mencionado.\n\n    Devuelve el resultado únicamente en formato JSON. Si una categoría no tiene información, déjala como un string vacío.\n\n    Texto del sitio web:\n    ---\n    ${webContent}\n    ---\n\n    JSON de salida:\n    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    try {
        const jsonResponse = JSON.parse(response.text);
        return {
            companyInfo: jsonResponse.companyInfo || '',
            productsInfo: jsonResponse.productsInfo || '',
            promotionsInfo: jsonResponse.promotionsInfo || '',
        };
    } catch (e) {
        console.error("Failed to parse JSON from model response:", e);
        throw new Error("La IA no pudo procesar el contenido de la URL.");
    }
};
