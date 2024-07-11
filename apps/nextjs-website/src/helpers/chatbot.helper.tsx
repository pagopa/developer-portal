import { useEffect, useState } from 'react';
import { getChatbotQueries, sendChatbotQuery } from '@/lib/chatbot';
import { ChatbotQueries } from '@/lib/chatbot/queries';

export const useChatbot = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [queries, setQueries] = useState<ChatbotQueries>([]);
  useEffect(() => {
    if (sessionId) {
      return;
    }

    // Request sessionID form chatbotAPI
    setSessionId('sessionID');
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    getChatbotQueries(sessionId).then((response) => setQueries(response));
    setIsLoaded(true);
  }, [sessionId]);

  const sendQuery = (queryMessage: string) => {
    setIsAwaitingResponse(true);
    sendChatbotQuery({
      sessionId: sessionId || '',
      query: queryMessage,
      queriedAt: new Date().toISOString(),
    }).then((response) => {
      setIsAwaitingResponse(false);
      setQueries([...queries, response]);
    });
  };

  return {
    isLoaded,
    isAwaitingResponse,
    queries,
    sendQuery,
  };
};
