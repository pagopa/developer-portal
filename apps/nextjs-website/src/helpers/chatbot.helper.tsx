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

    getChatbotQueries(sessionId).then((response) => setQueries(response));
    setIsLoaded(true);
  }, [sessionId, isUserAuthenticated]);

  const sendQuery = (queryMessage: string) => {
    setIsAwaitingResponse(true);
    sendChatbotQuery({
      sessionId: sessionId || '',
      question: queryMessage,
      queriedAt: new Date().toISOString(),
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
