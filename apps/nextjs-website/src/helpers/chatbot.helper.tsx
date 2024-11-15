'use client';
import { useEffect, useState } from 'react';
import {
  sendChatbotQuery,
  sendChatbotFeedback,
  getChatbotSessionsHistory,
  getChatbotQueries,
  deleteChatbotSession,
} from '@/lib/chatbotApi';
import {
  ChatbotQueriesCodec,
  PaginatedSessions,
  Query,
} from '@/lib/chatbot/queries';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';

const HISTORY_PAGE_SIZE = 10;
const EXPIRE_CHAT_DATE_LOCAL_STORAGE_KEY = 'expireChatDate';
const CHAT_QUERIES_LOCAL_STORAGE_KEY = 'chatQueries';

export type ChatbotErrorsType =
  | 'serviceDown'
  | 'queryFailed'
  | 'feedbackFailed';

function getExpireChatDateFromLocalStorage() {
  const queriesDate = localStorage.getItem(EXPIRE_CHAT_DATE_LOCAL_STORAGE_KEY);
  return queriesDate ? new Date(queriesDate) : null;
}

function getChatQueriesFromLocalStorage(): Query[] {
  const currentDate = new Date();
  const expireChatDate = getExpireChatDateFromLocalStorage();
  const queriesStringify = localStorage.getItem(CHAT_QUERIES_LOCAL_STORAGE_KEY);
  if (!expireChatDate || !queriesStringify || currentDate > expireChatDate) {
    flushChatQueriesFromLocalStorage();
    return [];
  }
  const validation = ChatbotQueriesCodec.decode(JSON.parse(queriesStringify));
  const queries = pipe(
    validation,
    E.fold(
      () => () => [],
      (result) => () => {
        return result;
      }
    )
  )();
  return queries;
}

function setChatQueriesInLocalStorage(queries: Query[]) {
  if (!getExpireChatDateFromLocalStorage()) {
    const expireDate = new Date();
    expireDate.setHours(0, 0, 0, 0);
    expireDate.setDate(new Date().getDate() + 1);
    localStorage.setItem(
      EXPIRE_CHAT_DATE_LOCAL_STORAGE_KEY,
      expireDate.toISOString()
    );
  }
  const queriesStringify = JSON.stringify(queries);
  localStorage.setItem(CHAT_QUERIES_LOCAL_STORAGE_KEY, queriesStringify);
}

export function flushChatQueriesFromLocalStorage() {
  localStorage.removeItem(EXPIRE_CHAT_DATE_LOCAL_STORAGE_KEY);
  localStorage.removeItem(CHAT_QUERIES_LOCAL_STORAGE_KEY);
}

function setFeedbackByQueryId(
  queries: Query[],
  queryId: string,
  hasNegativeFeedback: boolean
) {
  return queries.map((query) => {
    if (query.id === queryId) {
      return { ...query, badAnswer: hasNegativeFeedback };
    }
    return query;
  });
}

export const useChatbot = (isUserAuthenticated: boolean) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const [chatQueries, setChatQueries] = useState<Query[]>([]);
  const [historyQueries, setHistoryQueries] = useState<Query[]>([]);
  const [paginatedSessionsLoading, setPaginatedSessionsLoading] =
    useState(true);
  const [paginatedSessions, setPaginatedSessions] =
    useState<PaginatedSessions | null>(null);
  const [chatbotError, setChatbotError] = useState<ChatbotErrorsType | null>(
    null
  );

  useEffect(() => {
    if (!isUserAuthenticated) {
      return;
    }

    getChatbotQueries()
      .then((response) => {
        setChatQueries(getChatQueriesFromLocalStorage());
        setHistoryQueries(response);
      })
      .finally(() => setIsLoaded(true));
  }, [isUserAuthenticated]);

  const sendQuery = (queryMessage: string) => {
    setIsAwaitingResponse(true);
    const queriedAt = new Date().toISOString();
    const previousQueries = chatQueries;
    const newQuery = {
      id: '0',
      sessionId: '0',
      question: queryMessage,
      queriedAt: queriedAt,
      badAnswer: false,
      answer: null,
      createdAt: null,
    };
    setHistoryQueries([...historyQueries, newQuery]);

    const newChatQueries = [
      ...previousQueries,
      { ...newQuery, question: queryMessage },
    ];
    setChatQueries(newChatQueries);
    setChatQueriesInLocalStorage(newChatQueries);

    sendChatbotQuery({
      question: queryMessage,
      queriedAt: queriedAt,
      history: previousQueries,
    })
      .then((response) => {
        setIsAwaitingResponse(false);

        const newChatQueries = [
          ...chatQueries,
          { ...response, question: queryMessage },
        ];
        setChatQueries(newChatQueries);
        setChatQueriesInLocalStorage(newChatQueries);

        setHistoryQueries([...historyQueries, response]);
        setChatbotError(null);
      })
      .catch(() => {
        setIsAwaitingResponse(false);
        setChatbotError('queryFailed');
      });
    return null;
  };

  const sendFeedback = (
    hasNegativeFeedback: boolean,
    sessionId: string,
    queryId: string
  ) => {
    sendChatbotFeedback(hasNegativeFeedback, sessionId, queryId);
    const updatedChatQueries = setFeedbackByQueryId(
      chatQueries,
      queryId,
      hasNegativeFeedback
    );
    setChatQueries(updatedChatQueries);
    setChatQueriesInLocalStorage(updatedChatQueries);

    const updatedHistoryQueries = setFeedbackByQueryId(
      historyQueries,
      queryId,
      hasNegativeFeedback
    );
    setHistoryQueries(updatedHistoryQueries);
    return null;
  };

  const getSessionsByPage = (page: number) => {
    getChatbotSessionsHistory(page, HISTORY_PAGE_SIZE)
      .then((response) => setPaginatedSessions(response))
      .finally(() => setPaginatedSessionsLoading(false));

    return null;
  };

  const getSession = (sessionId: string) => getChatbotQueries(sessionId);

  return {
    isLoaded,
    isAwaitingResponse,
    historyQueries,
    chatQueries,
    sendQuery,
    sendFeedback,
    paginatedSessions,
    getSessionsByPage,
    getSession,
    paginatedSessionsLoading,
    deleteChatbotSession,
    chatbotError,
  };
};
