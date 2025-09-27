import React, { useState, useCallback, useEffect } from 'react';
import type { Message, ChatConfig, UsageStats } from './types';
import SettingsPanel from './components/SettingsPanel';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import BusinessProfile from './components/BusinessProfile';
import { getChatResponse } from './services/geminiService';

// Pricing constants
const PRICING: Record<ChatConfig['model'], { usdPerMillionInput: number, usdPerMillionOutput: number }> = {
    'gemini-2.5-flash': {
        usdPerMillionInput: 0.35,
        usdPerMillionOutput: 0.70,
    },
    'gemini-2.5-flash-lite': {
        usdPerMillionInput: 0.175, // Precio estimado, 50% más económico
        usdPerMillionOutput: 0.35,  // Precio estimado, 50% más económico
    },
};
const MXN_PER_USD = 18.0; // Approximate conversion rate

// Constants for humanizing long messages
const SPLIT_THRESHOLD = 280; // Split messages longer than 280 chars
const SPLIT_DELAY = 1500;    // Wait 1.5s before sending the second part

/**
 * Finds a natural split point in a text, like the end of a sentence.
 * @param text The text to split.
 * @param maxLength The desired maximum length for the first part.
 * @returns The index to split at, or -1 if no good split point is found.
 */
const findSplitPoint = (text: string, maxLength: number): number => {
    if (text.length <= maxLength) return -1;

    // Search for sentence endings in an ideal zone (60% to 100% of maxLength)
    const searchZoneEnd = maxLength;
    const searchZoneStart = Math.floor(maxLength * 0.6);

    for (let i = searchZoneEnd; i >= searchZoneStart; i--) {
        // Find punctuation followed by a space, newline, or end of string
        if ('.!?'.includes(text[i]) && (!text[i + 1] || ' \n'.includes(text[i + 1]))) {
            return i + 1; // Split after the punctuation
        }
    }
    
    // If no sentence end found, try a newline as a fallback in the same zone
    for (let i = searchZoneEnd; i >= searchZoneStart; i--) {
        if (text[i] === '\n') {
            return i + 1;
        }
    }

    // If no good split point is found, don't split
    return -1;
};


const ChatInterface: React.FC<{
  isSettingsVisible: boolean;
  onToggleSettings: () => void;
}> = ({ isSettingsVisible, onToggleSettings }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usageStats, setUsageStats] = useState<UsageStats>({
    lastExchangeTokens: 0,
    totalSessionTokens: 0,
    lastExchangeCost: 0,
    totalSessionCost: 0,
  });

  const [config, setConfig] = useState<ChatConfig>(() => {
    const defaultConfig: ChatConfig = {
      personality: 'Eres un asistente de atención al cliente servicial y amigable. Tu objetivo es resolver las dudas de los clientes sobre nuestros productos, servicios y políticas de la empresa de manera clara y concisa.',
      model: 'gemini-2.5-flash',
      minTokens: 100,
      maxTokens: 400,
      speechVoice: '',
      enableSpeech: true,
      companyInfo: "Somos 'Innovatech Solutions', una empresa líder en soluciones de software personalizadas. Fundada en 2010, nuestra misión es ayudar a las empresas a optimizar sus procesos a través de la tecnología. Nuestros valores son la innovación, la calidad y la satisfacción del cliente.",
      companyInfoCharLimit: 2000,
      productsInfo: "Ofrecemos tres productos principales:\n1. **Optimizador Pro**: Un sistema ERP para la gestión de recursos empresariales.\n2. **Conecta CRM**: Una plataforma para la gestión de relaciones con los clientes.\n3. **Analítica Web**: Herramientas de análisis de datos para sitios web y aplicaciones.",
      productsInfoCharLimit: 2000,
      promotionsInfo: "Actualmente tenemos dos promociones:\n- **20% de descuento** en la primera suscripción anual de 'Optimizador Pro'.\n- **Prueba gratuita de 30 días** para 'Conecta CRM' para nuevos clientes.",
      promotionsInfoCharLimit: 1000,
      faqs: [
        {
          id: 'faq-1',
          question: '¿Cuál es el horario de atención al cliente?',
          answer: 'Nuestro equipo de soporte está disponible de lunes a viernes, de 9:00 a.m. a 6:00 p.m. (hora central).'
        },
        {
          id: 'faq-2',
          question: '¿Ofrecen demostraciones de sus productos?',
          answer: 'Sí, ofrecemos demostraciones personalizadas de todos nuestros productos. Puedes solicitar una en nuestro sitio web.'
        },
        {
          id: 'faq-3',
          question: '¿Qué métodos de pago aceptan?',
          answer: 'Aceptamos tarjetas de crédito (Visa, MasterCard, American Express) y transferencias bancarias.'
        }
      ],
      proactiveAssistant: false,
    };

    try {
      const savedConfig = localStorage.getItem('chatConfig');
      if (savedConfig) {
        // Merge saved config with default to ensure all keys are present
        const parsedConfig = JSON.parse(savedConfig);
        return { ...defaultConfig, ...parsedConfig };
      }
    } catch (error) {
      console.error("Failed to load or parse config from localStorage:", error);
    }
    return defaultConfig;
  });

  // Effect to save config to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('chatConfig', JSON.stringify(config));
    } catch (error) {
      console.error("Failed to save config to localStorage:", error);
    }
  }, [config]);

  // This effect will trigger the proactive assistant if enabled
  useEffect(() => {
    const startProactiveChat = async () => {
      setIsLoading(true);
      try {
        const initialPrompt = "Inicia la conversación con un saludo amigable y una pregunta abierta sobre cómo puedes ayudar hoy. Sé breve y acogedor.";
        // Pass empty history
        const { text: responseContent, usageMetadata } = await getChatResponse(initialPrompt, [], config);

        // Update stats
        if (usageMetadata) {
            const inputTokens = usageMetadata.promptTokenCount || 0;
            const totalTokens = usageMetadata.totalTokenCount || 0;
            const outputTokens = totalTokens > inputTokens ? totalTokens - inputTokens : 0;
            const modelPricing = PRICING[config.model];
            const mxnPerInputToken = (modelPricing.usdPerMillionInput / 1_000_000) * MXN_PER_USD;
            const mxnPerOutputToken = (modelPricing.usdPerMillionOutput / 1_000_000) * MXN_PER_USD;
            const lastCost = (inputTokens * mxnPerInputToken) + (outputTokens * mxnPerOutputToken);

            setUsageStats(prevStats => ({
              lastExchangeTokens: inputTokens + outputTokens,
              totalSessionTokens: prevStats.totalSessionTokens + inputTokens + outputTokens,
              lastExchangeCost: lastCost,
              totalSessionCost: prevStats.totalSessionCost + lastCost,
            }));
        }

        // Add assistant message
        const assistantMessage: Message = { role: 'assistant', content: responseContent };
        setMessages([assistantMessage]);

      } catch (error) {
        console.error("Error initiating proactive chat:", error);
        const errorMessage: Message = {
          role: 'assistant',
          content: 'Hubo un error al iniciar la conversación. Por favor, intenta enviar un mensaje.'
        };
        setMessages([errorMessage]);
      } finally {
        setIsLoading(false);
      }
    };

    if (config.proactiveAssistant && messages.length === 0 && !isLoading) {
      startProactiveChat();
    }
    // We only want this effect to run when proactiveAssistant setting changes,
    // or when messages are cleared.
  }, [config.proactiveAssistant, messages.length, isLoading, config]);


  const handleSendMessage = useCallback(async (content: string) => {
    const newUserMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const { text: responseContent, usageMetadata } = await getChatResponse(content, messages, config);
      
      if (usageMetadata) {
        const inputTokens = usageMetadata.promptTokenCount || 0;
        const totalTokens = usageMetadata.totalTokenCount || 0;
        const outputTokens = totalTokens > inputTokens ? totalTokens - inputTokens : 0;
        
        const modelPricing = PRICING[config.model];
        const mxnPerInputToken = (modelPricing.usdPerMillionInput / 1_000_000) * MXN_PER_USD;
        const mxnPerOutputToken = (modelPricing.usdPerMillionOutput / 1_000_000) * MXN_PER_USD;
        const lastCost = (inputTokens * mxnPerInputToken) + (outputTokens * mxnPerOutputToken);

        setUsageStats(prevStats => ({
          lastExchangeTokens: inputTokens + outputTokens,
          totalSessionTokens: prevStats.totalSessionTokens + inputTokens + outputTokens,
          lastExchangeCost: lastCost,
          totalSessionCost: prevStats.totalSessionCost + lastCost,
        }));
      }

      const splitPoint = findSplitPoint(responseContent, SPLIT_THRESHOLD);

      if (splitPoint !== -1) {
        const part1 = responseContent.substring(0, splitPoint).trim();
        const part2 = responseContent.substring(splitPoint).trim();

        if (part1 && part2) {
          const assistantMessage1: Message = { role: 'assistant', content: part1 };
          setMessages(prev => [...prev, assistantMessage1]);

          setTimeout(() => {
            const assistantMessage2: Message = { role: 'assistant', content: part2 };
            setMessages(prev => [...prev, assistantMessage2]);
            setIsLoading(false); // Stop loading after the final part
          }, SPLIT_DELAY);
          return; // Exit to avoid the final setIsLoading(false)
        }
      }

      // If not split, send the whole message at once
      const assistantMessage: Message = { role: 'assistant', content: responseContent };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Hubo un error al contactar al asistente. Por favor, inténtalo de nuevo.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      // The loading state is managed inside the try block for the split message case
      // This will only run for non-split messages and errors
      const splitPoint = findSplitPoint(await getChatResponse(content, messages, config).then(r => r.text), SPLIT_THRESHOLD);
      if (splitPoint === -1) {
         setIsLoading(false);
      }
    }
  }, [messages, config]);

  return (
    <div className="relative flex w-full h-full font-sans bg-slate-900 text-white rounded-b-xl overflow-hidden">
      <main className="flex-1 flex flex-col h-full min-w-0 bg-slate-800">
        <ChatWindow messages={messages} isLoading={isLoading} config={config} />
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} stats={usageStats} />
      </main>
      <aside className={`
        transition-transform duration-300 ease-in-out transform
        absolute top-0 right-0 h-full w-full max-w-md
        lg:relative lg:max-w-md xl:max-w-lg
        ${isSettingsVisible ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <SettingsPanel config={config} onConfigChange={setConfig} onHide={onToggleSettings} />
      </aside>
    </div>
  );
};

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);


const App: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);
    const toggleSettings = () => setIsSettingsVisible(!isSettingsVisible);

    // Default to open on desktop, closed on mobile
    useEffect(() => {
        if (isOpen) {
            if (window.innerWidth >= 1024) {
                setIsSettingsVisible(true);
            } else {
                setIsSettingsVisible(false);
            }
        }
    }, [isOpen]);

    return (
        <>
            <BusinessProfile />

            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="fixed bottom-6 right-6 w-16 h-16 bg-amber-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-amber-700 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 z-50"
                    aria-label="Abrir chat"
                >
                    <ChatIcon />
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-6 right-6 lg:w-[800px] w-[90vw] lg:h-[700px] h-[85vh] bg-slate-900 rounded-xl shadow-2xl flex flex-col z-50 animate-fade-in-up">
                    <header className="flex items-center justify-between p-4 bg-slate-800 rounded-t-xl border-b border-slate-700 flex-shrink-0">
                        <h2 className="text-lg font-bold text-white">Asistente Virtual</h2>
                        <div className="flex items-center space-x-2">
                           <button
                                onClick={toggleSettings}
                                className="text-slate-400 hover:text-white"
                                aria-label="Configuración"
                            >
                                <SettingsIcon />
                            </button>
                            <button
                                onClick={toggleChat}
                                className="text-slate-400 hover:text-white"
                                aria-label="Cerrar chat"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                    </header>
                    <div className="flex-1 min-h-0">
                        <ChatInterface isSettingsVisible={isSettingsVisible} onToggleSettings={toggleSettings} />
                    </div>
                </div>
            )}
        </>
    );
};


export default App;