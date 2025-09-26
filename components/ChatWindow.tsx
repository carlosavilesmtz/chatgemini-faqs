
import React, { useRef, useEffect } from 'react';
import type { Message } from '../types';
import ChatMessage from './ChatMessage';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

const LoadingIndicator: React.FC = () => (
  <div className="flex items-start gap-4 my-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2h-4c-.74 0-1.4.4-1.72 1.05L6.5 6.5l-1.45-1.72C5.03 4.75 5 4.7 5 4.69c0-.4.32-.7.71-.7h2.59l2-2.5C10.63 1.17 11.02 1 11.5 1s.87.17 1.2.5l2 2.5h2.59c.39 0 .71.3.71.7 0 .01 0 .02-.02.04l-1.45 1.72 1.78 3.45C20.6 11.4 21 12.16 21 13v3c0 .55-.45 1-1 1h-2v2a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-2H6c-.55 0-1-.45-1-1v-3c0-.84.4-1.6.98-2.05L7.5 6.5l-1.78-3.45C5.4 2.4 5 1.64 5 1a1 1 0 0 1 1-1h2c.74 0 1.4.4 1.72 1.05L11.5 4.5l1.78-3.45C13.6.4 14.26 0 15 0h4a1 1 0 0 1 1 1c0 .64-.4 1.4-.98 2.05L17.5 6.5l1.78 3.45c.1.2.16.4.19.62L19.5 10.5l.02.04c-.01 0-.01 0-.02-.04Z M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        </svg>
    </div>
    <div className="max-w-xl rounded-xl px-4 py-3 bg-slate-700 text-slate-200 rounded-bl-none shadow-md">
      <div className="flex items-center space-x-2">
        <div className="h-2 w-2 bg-sky-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-sky-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-sky-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
            <h1 className="text-3xl font-bold text-slate-200">Asistente de Clientes IA</h1>
            <p className="mt-2">Empieza una conversación o ajusta la configuración en el panel.</p>
        </div>
      )}
      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg} />
      ))}
      {isLoading && <LoadingIndicator />}
    </div>
  );
};

export default ChatWindow;
