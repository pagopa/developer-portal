'use client';
import { useEffect, useState } from 'react';
import { getChatbotQueries, sendChatbotQuery } from '@/lib/chatbot';
import { Query } from '@/lib/chatbot/queries';

export const useChatbot = (isUserAuthenticated: boolean) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [queries, setQueries] = useState<Query[]>([]);

  useEffect(() => {
    if (sessionId || !isUserAuthenticated) {
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
        sessionId: '',
        question: queryMessage,
        queriedAt: queriedAt,
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

  return {
    isLoaded,
    isAwaitingResponse,
    queries,
    sendQuery,
  };
};
