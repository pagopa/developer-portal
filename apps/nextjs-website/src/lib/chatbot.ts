import * as E from 'fp-ts/lib/Either';
import { QueryInput } from '@/lib/chatbot/queries';
import { pipe } from 'fp-ts/lib/function';
import {
  getQueries,
  getSessions,
  patchFeedback,
  postQuery,
  getHealthz,
} from '@/lib/chatbot/chatbotApi';
import { makeChatbotEnv } from '@/lib/chatbot/chatbotEnv';
import { makeChatbotConfig, publicEnv } from '@/lib/chatbot/chatbotConfig';
import qs from 'qs';

const chatbotApiEnv = pipe(
  makeChatbotConfig(publicEnv),
  E.map(makeChatbotEnv),
  E.getOrElseW((errors) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw errors;
  })
);

export const sendChatbotQuery = (query: QueryInput) =>
  postQuery(query)(chatbotApiEnv);

export const getChatbotQueries = (sessionId: string) =>
  getQueries(qs.stringify({ sessionId: sessionId }))(chatbotApiEnv);

export const getChatbotHealthz = () => getHealthz()(chatbotApiEnv);

export const sendChatbotFeedback = (feedback: boolean, queryId: string) =>
  patchFeedback(feedback, queryId)(chatbotApiEnv);

export const getChatbotHistory = (page: number, pageSize: number) =>
  getSessions(page, pageSize)(chatbotApiEnv);
