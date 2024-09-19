'use client';
import { useEffect, useState } from 'react';
import {
  sendChatbotQuery,
  sendChatbotFeedback,
  getChatbotSessionsHistory,
  getChatbotQueries,
} from '@/lib/chatbot/chatbot';
import { PaginatedSessions, Query } from '@/lib/chatbot/queries';

const HISTORY_PAGE_SIZE = 10;

export const useChatbot = (isUserAuthenticated: boolean) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const [queries, setQueries] = useState<Query[]>([]);
  const [paginatedSessions, setPaginatedSessions] =
    useState<PaginatedSessions | null>(null);

  useEffect(() => {
    if (!isUserAuthenticated) {
      return;
    }

    getChatbotQueries()
      .then((response) => {
        setQueries(response);
      })
      .finally(() => setIsLoaded(true));
  }, [isUserAuthenticated]);

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
    getChatbotSessionsHistory(page, HISTORY_PAGE_SIZE).then((response) =>
      setPaginatedSessions(response)
    );

    return null;
  };

  return {
    isLoaded,
    isAwaitingResponse,
    queries,
    sendQuery,
    sendFeedback,
    paginatedSessions,
    getSessionsByPage,
  };
};
