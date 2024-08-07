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
  const { queries, sendQuery, isAwaitingResponse } = useChatbot(!!user);

  return (
    <>
      {isChatbotVisible && (
        <ChatbotLayout
          queries={queries}
          onSendQuery={sendQuery}
          sendDisabled={isAwaitingResponse}
        />
      )}
      {children}
    </>
  );
};

export default ChatbotProvider;
