'use client';
import { useEffect, useState } from 'react';
import {
  sendChatbotQuery,
  sendChatbotFeedback,
  getChatbotQueries,
  getChatbotHistory,
} from '@/lib/chatbot';
import { PaginatedSessions, Query } from '@/lib/chatbot/queries';

const HISTORY_PAGE_SIZE = 10;

export const useChatbot = (isUserAuthenticated: boolean) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [queries, setQueries] = useState<Query[]>([]);
  const [paginatedSessionsLoading, setPaginatedSessionsLoading] =
    useState(true);
  const [paginatedSessions, setPaginatedSessions] =
    useState<PaginatedSessions | null>(null);

  useEffect(() => {
    if (!isUserAuthenticated) {
      return;
    }

    // Request sessionID form chatbotAPI
    setSessionId('sessionID');
  }, [sessionId, isUserAuthenticated]);

  useEffect(() => {
    if (!sessionId || !isUserAuthenticated) {
      return;
    }

    // PENDING Chatbot API
    // getChatbotQueries(sessionId).then((response) => setQueries(response));
    setIsLoaded(true);
  }, [sessionId, isUserAuthenticated]);

  const sendQuery = (queryMessage: string) => {
    setIsAwaitingResponse(true);
    const queriedAt = new Date().toISOString();
    setQueries([
      ...queries,
      {
        id: '0',
        sessionId: '0',
        question: queryMessage,
        queriedAt: queriedAt,
        badAnswer: false,
        answer: null,
        createdAt: null,
      },
    ]);
    sendChatbotQuery({
      sessionId: sessionId || '',
      question: queryMessage,
      queriedAt: queriedAt,
    }).then((response) => {
      setIsAwaitingResponse(false);
      setQueries([...queries, response]);
    });
    return null;
  };

  const sendFeedback = (queryId: string, hasNegativeFeedback: boolean) => {
    sendChatbotFeedback(hasNegativeFeedback, queryId);
    const updatedQueries = queries.map((query) => {
      if (query.id === queryId) {
        return {
          ...query,
          badAnswer: hasNegativeFeedback,
        };
      }
      return query;
    });
    setQueries(updatedQueries);
    return null;
  };

  const getSessionsByPage = (page: number) => {
    getChatbotHistory(page, HISTORY_PAGE_SIZE).then((response) =>
      setPaginatedSessions(response)
    ).finally(() => setPaginatedSessionsLoading(false));;

    return null;
  };

  const getSession = (sessionId: string) => getChatbotQueries(sessionId);

  return {
    isLoaded,
    isAwaitingResponse,
    queries,
    sendQuery,
    sendFeedback,
    paginatedSessions,
    getSessionsByPage,
    getSession,
    paginatedSessionsLoading,
  };
};
