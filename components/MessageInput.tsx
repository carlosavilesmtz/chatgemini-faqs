
import React, { useState, useEffect, useRef } from 'react';
import type { UsageStats } from '../types';
import TokenUsage from './TokenUsage';

// FIX: Add type definitions for Web Speech API to fix TypeScript errors.
// These types are not included in standard DOM typings.
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  start(): void;
  stop(): void;
}


interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  stats: UsageStats;
}

const MicIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className || "w-6 h-6"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd"></path></svg>
);


const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, stats }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInput(input + finalTranscript + interimTranscript);
    };

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
    }
    
    recognitionRef.current = recognition;

  }, [input]);


  const handleListen = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Clear previous text before starting new recognition
      setInput(''); 
      recognitionRef.current.start();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      if (isListening) {
          recognitionRef.current?.stop();
      }
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  }

  return (
    <div className="p-4 bg-slate-900 border-t border-slate-700">
      <TokenUsage stats={stats} />
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Escuchando..." : "Escribe tu pregunta aquí..."}
          rows={1}
          className="flex-1 bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 transition duration-200 resize-none"
          disabled={isLoading}
        />
        <button
            type="button"
            onClick={handleListen}
            disabled={isLoading}
            className={`p-2 text-white rounded-full transition-colors duration-200 ${
                isListening 
                ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                : 'bg-slate-600 hover:bg-slate-500'
            } disabled:bg-slate-500 disabled:cursor-not-allowed`}
            aria-label={isListening ? "Detener grabación" : "Grabar pregunta"}
        >
          <MicIcon />
        </button>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="inline-flex justify-center p-2 text-white rounded-full cursor-pointer bg-sky-600 hover:bg-sky-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;