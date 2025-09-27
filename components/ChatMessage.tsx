
import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  speechVoice: string;
  enableSpeech: boolean;
}

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M12 2a5 5 0 0 1 5 5v1.277a3.5 3.5 0 0 1 2.5 3.223V14a5 5 0 0 1-5 5h-5a5 5 0 0 1-5-5v-2.5a3.5 3.5 0 0 1 2.5-3.223V7a5 5 0 0 1 5-5Zm-3 7a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm1.5 5.5a4.5 4.5 0 0 0-3 3.5A1.5 1.5 0 0 0 9 20h6a1.5 1.5 0 0 0 1.5-1.5 4.5 4.5 0 0 0-3-3.5h-3Z" clipRule="evenodd" />
  </svg>
);

const AssistantIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a2 2 0 0 0-2 2v2H8a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a2 2 0 0 0 2 2h2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2v-2h2a2 2 0 0 0 2-2v-2h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2V8a2 2 0 0 0-2-2h-2V4a2 2 0 0 0-2-2zm-4 8h8v4H8v-4z"/>
  </svg>
);


const SpeakerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" clipRule="evenodd" />
        <path d="M16.071 5.071a1 1 0 011.414 0A6.98 6.98 0 0119 10a6.98 6.98 0 01-1.515 4.929 1 1 0 11-1.414-1.414A4.982 4.982 0 0017 10a4.982 4.982 0 00-1.071-3.071 1 1 0 010-1.414z" />
    </svg>
);


const ChatMessage: React.FC<ChatMessageProps> = ({ message, speechVoice, enableSpeech }) => {
  const isUser = message.role === 'user';

  const formatContent = (text: string) => {
    // Replace **text** with <strong>text</strong> for bolding
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return { __html: formattedText };
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window && message.content) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Clean up markdown for better pronunciation
      const textToSpeak = message.content.replace(/\*\*/g, '');
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'es-ES'; // Set language to Spanish

      // Find and set the selected voice
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(voice => voice.name === speechVoice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Tu navegador no soporta la síntesis de voz.');
    }
  };


  return (
    <div className={`flex items-start gap-4 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
          <AssistantIcon />
        </div>
      )}
      <div
        className={`relative group max-w-xl rounded-xl px-4 py-3 shadow-md ${
          isUser
            ? 'bg-sky-600 text-white rounded-br-none'
            : 'bg-slate-700 text-slate-200 rounded-bl-none'
        }`}
      >
        <p 
          className="text-sm whitespace-pre-wrap"
          dangerouslySetInnerHTML={formatContent(message.content)}
        />
        {!isUser && message.content && enableSpeech && (
           <button 
             onClick={handleSpeak}
             className="absolute -bottom-3 -right-3 p-1.5 rounded-full bg-slate-600 hover:bg-sky-600 opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
             aria-label="Leer mensaje en voz alta"
           >
             <SpeakerIcon />
           </button>
        )}
      </div>
       {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
          <UserIcon />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;