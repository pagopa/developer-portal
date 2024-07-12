import { ChatbotConfig } from '@/lib/chatbot/chatbotConfig';
import { Auth } from 'aws-amplify';

// This type represents the environment of Chatbot.
export type ChatbotEnv = {
  readonly config: ChatbotConfig;
  readonly getAuthToken: () => Promise<string>;
  readonly fetch: typeof fetch;
};

export const makeChatbotEnv = (config: ChatbotConfig): ChatbotEnv => ({
  config: config,
  getAuthToken: async () => Promise.resolve(''),
  fetch: fetch,
});
