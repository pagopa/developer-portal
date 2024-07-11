import { ChatbotConfig } from '@/lib/chatbot/chatbotConfig';

// This type represents the environment of Chatbot.
export type ChatbotEnv = {
  readonly config: ChatbotConfig;
  readonly fetch: typeof fetch;
};

export const makeChatbotEnv = (config: ChatbotConfig): ChatbotEnv => ({
  config: config,
  fetch: fetch,
});
