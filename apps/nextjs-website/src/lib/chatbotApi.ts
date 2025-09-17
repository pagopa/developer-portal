import * as E from 'fp-ts/lib/Either';
import { QueryInput } from '@/lib/chatbot/queries';
import { pipe } from 'fp-ts/lib/function';
import {
  getQueries,
  patchFeedback,
  postQuery
} from '@/lib/chatbot/chatbotQueries';
import { makeChatbotEnv } from '@/lib/chatbot/chatbotEnv';
import { makeChatbotConfig, publicEnv } from '@/lib/chatbot/chatbotConfig';
import qs from 'qs';
import { getHealthz } from './chatbot/chatbotHealthz';
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

export const getChatbotHealthz = () => getHealthz()(chatbotApiEnv);

export const sendChatbotFeedback = (
  feedback: boolean,
  sessionId: string,
  queryId: string,
  user_response_relevancy: number | null,
  user_faithfullness: number | null,
  user_comment: string
) =>
  patchFeedback(
    feedback,
    sessionId,
    queryId,
    user_response_relevancy,
    user_faithfullness,
    user_comment
  )(chatbotApiEnv);

export const getChatbotSessionsHistory = (page: number, pageSize: number) =>
  getSessions(page, pageSize)(chatbotApiEnv);

export const deleteChatbotSession = (sessionId: string) =>
  deleteSession(sessionId)(chatbotApiEnv);
