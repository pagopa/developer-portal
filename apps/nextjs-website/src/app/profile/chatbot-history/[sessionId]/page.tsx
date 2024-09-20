'use client';

import React, { useEffect, useState } from 'react';
import { useChatbot } from '@/helpers/chatbot.helper';
import { useUser } from '@/helpers/user.helper';
import ChatbotHistoryDetailLayout from '@/components/organisms/ChatbotHistoryDetailLayout/ChatbotHistoryDetailLayout';
import { Query } from '@/lib/chatbot/queries';
import { Box } from '@mui/material';
import Router from 'next/router';

const ChatbotHistoryDetails = ({
  params,
}: {
  params: { sessionId: string };
}) => {
  const { user } = useUser();
  const { getSession, deleteSession } = useChatbot(true);
  const [session, setSession] = useState<Query[]>([]);
  const sessionId = params.sessionId;
  useEffect(() => {
    getSession(sessionId).then((response) => {
      setSession(response);
    });
  }, []);

  if (!user) {
    return null;
  }

  return (
    <Box
      sx={{
        padding: { xs: '40px 24px', md: '80px 40px' },
        width: '100%',
        maxWidth: '694px',
      }}
    >
      <ChatbotHistoryDetailLayout
        queries={session}
        userName={`${user.attributes.given_name} `}
        onDeleteChatSession={(sessionId: string) => {
          deleteSession(sessionId).then(() =>
            // eslint-disable-next-line functional/immutable-data
            Router.push('/profile/chatbot-history')
          );
          return null;
        }}
      />
    </Box>
  );
};

export default ChatbotHistoryDetails;
