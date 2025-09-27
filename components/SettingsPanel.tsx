import React, { useState, useEffect } from 'react';
import type { ChatConfig, FaqItem } from '../types';
import { enhancePrompt } from '../services/geminiService';

interface SettingsPanelProps {
  config: ChatConfig;
  onConfigChange: (newConfig: ChatConfig) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ config, onConfigChange }) => {
  const MAX_FAQS = 10;
  const [localConfig, setLocalConfig] = useState<ChatConfig>(config);
  const [isSaved, setIsSaved] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isEnhancing, setIsEnhancing] = useState({
    companyInfo: false,
    productsInfo: false,
    promotionsInfo: false,
  });

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  // Effect to load available speech synthesis voices from the browser
  useEffect(() => {
    const getAndSetVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      getAndSetVoices();
      window.speechSynthesis.onvoiceschanged = getAndSetVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Effect to set a default voice once voices are loaded, if one isn't already set
  useEffect(() => {
    if (availableVoices.length > 0 && !localConfig.speechVoice) {
      const spanishVoices = availableVoices.filter(v => v.lang.startsWith('es'));
      const defaultVoice =
        spanishVoices.find(v => v.name.includes('Google') && v.lang === 'es-ES') ||
        spanishVoices.find(v => v.lang === 'es-ES') ||
        spanishVoices.find(v => v.lang === 'es-US') ||
        spanishVoices[0] ||
        availableVoices[0];

      if (defaultVoice) {
        setLocalConfig(prev => ({ ...prev, speechVoice: defaultVoice.name }));
      }
    }
  }, [availableVoices, localConfig.speechVoice]);


  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['minTokens', 'maxTokens', 'companyInfoCharLimit', 'productsInfoCharLimit', 'promotionsInfoCharLimit'].includes(name);
    
    setLocalConfig(prevConfig => ({
        ...prevConfig,
        [name]: isNumeric ? (value === '' ? 0 : parseInt(value, 10)) : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setLocalConfig({
      ...localConfig,
      [name]: checked,
    });
  };

  const handleFaqChange = (id: string, field: 'question' | 'answer', value: string) => {
    const updatedFaqs = localConfig.faqs.map(faq =>
      faq.id === id ? { ...faq, [field]: value } : faq
    );
    setLocalConfig({ ...localConfig, faqs: updatedFaqs });
  };

  const addFaq = () => {
    if (localConfig.faqs.length < MAX_FAQS) {
      const newFaq: FaqItem = { id: Date.now().toString(), question: '', answer: '' };
      setLocalConfig({ ...localConfig, faqs: [...localConfig.faqs, newFaq] });
    }
  };

  const removeFaq = (id: string) => {
    const updatedFaqs = localConfig.faqs.filter(faq => faq.id !== id);
    setLocalConfig({ ...localConfig, faqs: updatedFaqs });
  };

  const handleSave = () => {
    // Clamp values to be within reasonable limits on save
    const clampedConfig = {
      ...localConfig,
      companyInfo: localConfig.companyInfo.slice(0, localConfig.companyInfoCharLimit),
      productsInfo: localConfig.productsInfo.slice(0, localConfig.productsInfoCharLimit),
      promotionsInfo: localConfig.promotionsInfo.slice(0, localConfig.promotionsInfoCharLimit),
    };
    onConfigChange(clampedConfig);
    setIsSaved(true);
    const timer = setTimeout(() => setIsSaved(false), 3000);
    return () => clearTimeout(timer);
  };

  const handleEnhanceClick = async (
    field: 'companyInfo' | 'productsInfo' | 'promotionsInfo',
    context: string
  ) => {
    setIsEnhancing(prev => ({ ...prev, [field]: true }));
    try {
        const currentText = localConfig[field];
        const enhancedText = await enhancePrompt(currentText, context);
        setLocalConfig(prev => ({ ...prev, [field]: enhancedText }));
    } catch (error) {
        console.error(`Failed to enhance ${field}:`, error);
        // Optionally, show an error message to the user
    } finally {
        setIsEnhancing(prev => ({ ...prev, [field]: false }));
    }
  };

  return (
    <div className="w-full lg:w-96 bg-slate-800 flex flex-col border-l border-slate-700 h-full">
      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Configuración</h2>
          <p className="text-sm text-slate-400">Define la personalidad y el conocimiento de tu asistente.</p>
        </div>

        <div className="border-t border-slate-700"></div>

        {/* Basic Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Ajustes Generales</h3>
           <div className="flex flex-col space-y-2">
            <label htmlFor="personality" className="text-sm font-medium text-slate-300">Personalidad del Asistente</label>
            <textarea
              id="personality"
              name="personality"
              rows={4}
              value={localConfig.personality}
              onChange={handleInputChange}
              className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 transition duration-200"
              placeholder="Ej: Eres un asistente amigable y servicial..."
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="model" className="text-sm font-medium text-slate-300">Modelo de IA</label>
            <select id="model" name="model" value={localConfig.model} onChange={handleInputChange} className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 transition duration-200">
              <option value="gemini-2.5-flash">gemini-2.5-flash</option>
              <option value="gemini-2.5-flash-lite">gemini-2.5-flash-lite (más económico)</option>
            </select>
          </div>
          <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
              <div className="flex flex-col">
                  <label htmlFor="enableSpeech" className="text-sm font-medium text-slate-200 cursor-pointer">
                  Habilitar Audio de Voz
                  </label>
                  <p className="text-xs text-slate-400">Permite reproducir las respuestas del asistente.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                  type="checkbox" 
                  id="enableSpeech" 
                  name="enableSpeech"
                  checked={localConfig.enableSpeech} 
                  onChange={handleCheckboxChange} 
                  className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
          </div>
          <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
              <div className="flex flex-col">
                  <label htmlFor="proactiveAssistant" className="text-sm font-medium text-slate-200 cursor-pointer">
                  Asistente Proactivo
                  </label>
                  <p className="text-xs text-slate-400">Permite que el asistente inicie la conversación.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                  type="checkbox" 
                  id="proactiveAssistant" 
                  name="proactiveAssistant"
                  checked={localConfig.proactiveAssistant} 
                  onChange={handleCheckboxChange} 
                  className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="speechVoice" className="text-sm font-medium text-slate-300">Voz del Asistente</label>
            <select
              id="speechVoice"
              name="speechVoice"
              value={localConfig.speechVoice}
              onChange={handleInputChange}
              className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={availableVoices.length === 0 || !localConfig.enableSpeech}
            >
              {availableVoices.length === 0 ? (
                <option>Cargando voces...</option>
              ) : (
                availableVoices.map(voice => (
                  <option key={voice.name} value={voice.name}>
                    {`${voice.name} (${voice.lang})`}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
                <label htmlFor="minTokens" className="text-sm font-medium text-slate-300">Tokens Mín.</label>
                <input type="number" id="minTokens" name="minTokens" value={localConfig.minTokens} onChange={handleInputChange} min="50" max="1000" step="10" className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 transition duration-200" />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="maxTokens" className="text-sm font-medium text-slate-300">Tokens Máx.</label>
              <input type="number" id="maxTokens" name="maxTokens" value={localConfig.maxTokens} onChange={handleInputChange} min="100" max="8192" step="10" className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 transition duration-200" />
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700"></div>
        
        {/* Integrations */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Integraciones</h3>
            <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
                <div className="flex flex-col">
                    <label htmlFor="googleCalendarIntegration" className="text-sm font-medium text-slate-200 cursor-pointer">
                    Google Calendar (Simulado)
                    </label>
                    <p className="text-xs text-slate-400">Permite al asistente consultar tu agenda.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                    type="checkbox" 
                    id="googleCalendarIntegration" 
                    name="googleCalendarIntegration"
                    checked={localConfig.googleCalendarIntegration} 
                    onChange={handleCheckboxChange} 
                    className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                </label>
            </div>
        </div>


        <div className="border-t border-slate-700"></div>

        {/* Business Context */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Base de Conocimiento</h3>
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="companyInfo" className="text-sm font-medium text-slate-300">Información de la Empresa</label>
            <textarea id="companyInfo" name="companyInfo" rows={5} value={localConfig.companyInfo} onChange={handleInputChange} className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 transition duration-200" placeholder="Describe tu empresa, misión, visión, etc." maxLength={localConfig.companyInfoCharLimit} />
            <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                <span>Límite de caracteres:</span>
                <input type="number" name="companyInfoCharLimit" value={localConfig.companyInfoCharLimit} onChange={handleInputChange} className="w-20 bg-slate-600 text-white text-center rounded" min="100" max="5000" step="100" />
                <span>{`${localConfig.companyInfo.length} / ${localConfig.companyInfoCharLimit}`}</span>
            </div>
             <button onClick={() => handleEnhanceClick('companyInfo', 'Información de la Empresa')} disabled={isEnhancing.companyInfo} className="mt-2 w-full text-sm font-medium text-sky-400 bg-sky-400/10 hover:bg-sky-400/20 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed py-2 px-4 rounded-lg transition-colors">
              {isEnhancing.companyInfo ? 'Mejorando...' : 'Mejorar con IA ✨'}
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="productsInfo" className="text-sm font-medium text-slate-300">Productos y Servicios</label>
            <textarea id="productsInfo" name="productsInfo" rows={5} value={localConfig.productsInfo} onChange={handleInputChange} className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 transition duration-200" placeholder="Detalla tus productos o servicios." maxLength={localConfig.productsInfoCharLimit} />
            <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                <span>Límite de caracteres:</span>
                <input type="number" name="productsInfoCharLimit" value={localConfig.productsInfoCharLimit} onChange={handleInputChange} className="w-20 bg-slate-600 text-white text-center rounded" min="100" max="5000" step="100" />
                <span>{`${localConfig.productsInfo.length} / ${localConfig.productsInfoCharLimit}`}</span>
            </div>
            <button onClick={() => handleEnhanceClick('productsInfo', 'Productos y Servicios')} disabled={isEnhancing.productsInfo} className="mt-2 w-full text-sm font-medium text-sky-400 bg-sky-400/10 hover:bg-sky-400/20 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed py-2 px-4 rounded-lg transition-colors">
              {isEnhancing.productsInfo ? 'Mejorando...' : 'Mejorar con IA ✨'}
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="promotionsInfo" className="text-sm font-medium text-slate-300">Promociones</label>
            <textarea id="promotionsInfo" name="promotionsInfo" rows={3} value={localConfig.promotionsInfo} onChange={handleInputChange} className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 transition duration-200" placeholder="Informa sobre descuentos actuales." maxLength={localConfig.promotionsInfoCharLimit} />
            <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                <span>Límite de caracteres:</span>
                <input type="number" name="promotionsInfoCharLimit" value={localConfig.promotionsInfoCharLimit} onChange={handleInputChange} className="w-20 bg-slate-600 text-white text-center rounded" min="50" max="2000" step="50" />
                <span>{`${localConfig.promotionsInfo.length} / ${localConfig.promotionsInfoCharLimit}`}</span>
            </div>
            <button onClick={() => handleEnhanceClick('promotionsInfo', 'Promociones Actuales')} disabled={isEnhancing.promotionsInfo} className="mt-2 w-full text-sm font-medium text-sky-400 bg-sky-400/10 hover:bg-sky-400/20 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed py-2 px-4 rounded-lg transition-colors">
              {isEnhancing.promotionsInfo ? 'Mejorando...' : 'Mejorar con IA ✨'}
            </button>
          </div>
        </div>

        <div className="border-t border-slate-700"></div>

        {/* FAQs Section */}
        <div className="flex flex-col space-y-4 pb-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Preguntas Frecuentes</h3>
            <span className="text-sm font-medium text-slate-400">{`${localConfig.faqs.length} / ${MAX_FAQS}`}</span>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {localConfig.faqs.map((faq, index) => (
              <div key={faq.id} className="bg-slate-700/50 p-3 rounded-lg space-y-2 relative">
                <button onClick={() => removeFaq(faq.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-400 transition-colors" aria-label="Eliminar FAQ">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.707 7.293a1 1 0 0 0-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 1 0 1.414 1.414L10 11.414l1.293 1.293a1 1 0 0 0 1.414-1.414L11.414 10l1.293-1.293a1 1 0 0 0-1.414-1.414L10 8.586 8.707 7.293Z" clipRule="evenodd" /></svg>
                </button>
                <input type="text" placeholder={`Pregunta #${index + 1}`} value={faq.question} onChange={(e) => handleFaqChange(faq.id, 'question', e.target.value)} className="w-full bg-slate-600 border border-slate-500 text-white text-sm rounded-md focus:ring-sky-500 focus:border-sky-500 p-2 transition" maxLength={200} />
                <textarea placeholder="Respuesta" rows={3} value={faq.answer} onChange={(e) => handleFaqChange(faq.id, 'answer', e.target.value)} className="w-full bg-slate-600 border border-slate-500 text-white text-sm rounded-md focus:ring-sky-500 focus:border-sky-500 p-2 transition resize-none" maxLength={500} />
                 <div className="text-right text-xs text-slate-400">
                    <span>{`${faq.question.length}/200`}</span> | <span>{`${faq.answer.length}/500`}</span>
                 </div>
              </div>
            ))}
          </div>
          <button onClick={addFaq} disabled={localConfig.faqs.length >= MAX_FAQS} className="w-full text-sm font-medium text-sky-400 bg-sky-400/10 hover:bg-sky-400/20 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed py-2 px-4 rounded-lg transition-colors">
            Añadir FAQ
          </button>
        </div>
      </div>
      
      {/* Action Footer */}
      <div className="p-6 border-t border-slate-700 bg-slate-800/80 backdrop-blur-sm">
        <button 
          onClick={handleSave}
          className="w-full bg-sky-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-all duration-200 ease-in-out"
        >
          Guardar Cambios
        </button>
        {isSaved && (
          <p className="text-center text-sm text-green-400 mt-3 transition-opacity duration-300">
            ¡Configuración guardada con éxito!
          </p>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;
