
import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M12 2a5 5 0 0 1 5 5v1.277a3.5 3.5 0 0 1 2.5 3.223V14a5 5 0 0 1-5 5h-5a5 5 0 0 1-5-5v-2.5a3.5 3.5 0 0 1 2.5-3.223V7a5 5 0 0 1 5-5Zm-3 7a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm1.5 5.5a4.5 4.5 0 0 0-3 3.5A1.5 1.5 0 0 0 9 20h6a1.5 1.5 0 0 0 1.5-1.5 4.5 4.5 0 0 0-3-3.5h-3Z" clipRule="evenodd" />
  </svg>
);

const AssistantIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2h-4c-.74 0-1.4.4-1.72 1.05L6.5 6.5l-1.45-1.72C5.03 4.75 5 4.7 5 4.69c0-.4.32-.7.71-.7h2.59l2-2.5C10.63 1.17 11.02 1 11.5 1s.87.17 1.2.5l2 2.5h2.59c.39 0 .71.3.71.7 0 .01 0 .02-.02.04l-1.45 1.72 1.78 3.45C20.6 11.4 21 12.16 21 13v3c0 .55-.45 1-1 1h-2v2a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-2H6c-.55 0-1-.45-1-1v-3c0-.84.4-1.6.98-2.05L7.5 6.5l-1.78-3.45C5.4 2.4 5 1.64 5 1a1 1 0 0 1 1-1h2c.74 0 1.4.4 1.72 1.05L11.5 4.5l1.78-3.45C13.6.4 14.26 0 15 0h4a1 1 0 0 1 1 1c0 .64-.4 1.4-.98 2.05L17.5 6.5l1.78 3.45c.1.2.16.4.19.62L19.5 10.5l.02.04c-.01 0-.01 0-.02-.04Z M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
  </svg>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const formatContent = (text: string) => {
    // Replace **text** with <strong>text</strong> for bolding
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return { __html: formattedText };
  };

  return (
    <div className={`flex items-start gap-4 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
          <AssistantIcon />
        </div>
      )}
      <div
        className={`max-w-xl rounded-xl px-4 py-3 shadow-md ${
          isUser
            ? 'bg-sky-600 text-white rounded-br-none'
            : 'bg-slate-700 text-slate-200 rounded-bl-none'
        }`}
      >
        <p 
          className="text-sm whitespace-pre-wrap"
          dangerouslySetInnerHTML={formatContent(message.content)}
        />
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
