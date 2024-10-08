import * as E from 'fp-ts/lib/Either';
import { QueryInput } from '@/lib/chatbot/queries';
import { pipe } from 'fp-ts/lib/function';
import {
  getQueries,
  patchFeedback,
  postQuery,
} from '@/lib/chatbot/chatbotQueries';
import { makeChatbotEnv } from '@/lib/chatbot/chatbotEnv';
import { makeChatbotConfig, publicEnv } from '@/lib/chatbot/chatbotConfig';
import qs from 'qs';
import { deleteSession, getSessions } from './chatbot/chatbotSessions';

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

export const getChatbotQueries = (sessionId?: string) =>
  getQueries((sessionId && qs.stringify({ sessionId: sessionId })) || '')(
    chatbotApiEnv
  );

export const sendChatbotFeedback = (feedback: boolean, queryId: string) =>
  patchFeedback(feedback, queryId)(chatbotApiEnv);

export const getChatbotSessionsHistory = (page: number, pageSize: number) =>
  getSessions(page, pageSize)(chatbotApiEnv);

export const deleteChatbotSession = (sessionId: string) =>
  deleteSession(sessionId)(chatbotApiEnv);
