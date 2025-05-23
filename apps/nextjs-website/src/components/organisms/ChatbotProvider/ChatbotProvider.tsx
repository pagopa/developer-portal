'use client';

import { useUser } from '@/helpers/user.helper';
import { FC, PropsWithChildren } from 'react';
import ChatbotLayout from '@/components/organisms/ChatbotLayout/ChatbotLayout';
import { useChatbot } from '@/helpers/chatbot.helper';

type ChatbotProviderProps = {
  isChatbotVisible: boolean;
};

const ChatbotProvider: FC<PropsWithChildren<ChatbotProviderProps>> = ({
  children,
  isChatbotVisible,
}) => {
  const { user } = useUser();
  const {
    chatQueries,
    sendQuery,
    sendFeedback,
    isAwaitingResponse,
    areChatbotQueriesLoaded,
    chatbotError,
  } = useChatbot(!!user);

  return (
    <>
      {isChatbotVisible && (
        <ChatbotLayout
          queries={chatQueries}
          onSendQuery={sendQuery}
          onSendFeedback={sendFeedback}
          isAwaitingResponse={isAwaitingResponse}
          areChatbotQueriesLoaded={areChatbotQueriesLoaded}
          error={chatbotError}
          disabled={!user}
          mustFillFeedbackForm={
            user != null &&
            (user.attributes.email.includes('pagopa') ||
              user.attributes.email.includes('uqido'))
          }
        />
      )}
      {children}
    </>
  );
};

export default ChatbotProvider;
