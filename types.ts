export type MessageRole = 'user' | 'assistant';

export interface Message {
  role: MessageRole;
  content: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ChatConfig {
  personality: string;
  model: 'gemini-2.5-flash';
  minTokens: number;
  maxTokens: number;
  companyInfo: string;
  companyInfoCharLimit: number;
  productsInfo: string;
  productsInfoCharLimit: number;
  promotionsInfo: string;
  promotionsInfoCharLimit: number;
  faqs: FaqItem[];
  googleCalendarIntegration: boolean;
}