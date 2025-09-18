import * as E from 'fp-ts/lib/Either';

export type ChatbotConfig = {
  readonly CHATBOT_HOST: string;
};

export const publicEnv = {
  CHATBOT_HOST: process.env.NEXT_PUBLIC_CHATBOT_HOST,
};

export const makeChatbotConfig = (
  env: Record<string, undefined | string>
): E.Either<string, ChatbotConfig> =>
  env.CHATBOT_HOST
    ? E.right({ CHATBOT_HOST: env.CHATBOT_HOST })
    : E.left('Missing env var NEXT_PUBLIC_CHATBOT_HOST');
