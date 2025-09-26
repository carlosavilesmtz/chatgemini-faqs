import React, { useState, useCallback } from 'react';
import type { Message, ChatConfig } from './types';
import SettingsPanel from './components/SettingsPanel';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { getChatResponse } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<ChatConfig>({
    personality: 'Eres un asistente de atención al cliente servicial y amigable. Tu objetivo es resolver las dudas de los clientes sobre nuestros productos, servicios y políticas de la empresa de manera clara y concisa.',
    model: 'gemini-2.5-flash',
    minTokens: 100,
    maxTokens: 400,
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
    googleCalendarIntegration: false,
  });

  const handleSendMessage = useCallback(async (content: string) => {
    const newUserMessage: Message = { role: 'user', content };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const responseContent = await getChatResponse(content, messages, config);
      const assistantMessage: Message = { role: 'assistant', content: responseContent };
      setMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Hubo un error al contactar al asistente. Por favor, inténtalo de nuevo.'
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, config]);

  return (
    <div className="flex flex-col lg:flex-row h-screen font-sans bg-slate-900 text-white">
      <main className="flex-1 flex flex-col h-full">
        <ChatWindow messages={messages} isLoading={isLoading} />
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
      <aside className="w-full lg:w-auto lg:max-w-md xl:max-w-lg h-full">
        <SettingsPanel config={config} onConfigChange={setConfig} />
      </aside>
    </div>
  );
};

export default App;