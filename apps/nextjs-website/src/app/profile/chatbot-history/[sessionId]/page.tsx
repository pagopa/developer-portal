'use client';

import React, { useEffect, useState } from 'react';
import { useChatbot } from '@/helpers/chatbot.helper';
import { useUser } from '@/helpers/user.helper';
import ChatbotHistoryDetailLayout from '@/components/organisms/ChatbotHistoryDetailLayout/ChatbotHistoryDetailLayout';
import { Query } from '@/lib/chatbot/queries';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { isChatbotActive } from '@/config';
import { isEmpty } from 'fp-ts/lib/Array';

const ChatbotHistoryDetails = ({
  params,
}: {
  params: { sessionId: string };
}) => {
  const { user } = useUser();
  const { getSession, deleteSession } = useChatbot(true);
  const [session, setSession] = useState<Query[]>([]);
  const sessionId = params.sessionId;
  const router = useRouter();
  useEffect(() => {
    getSession(sessionId).then((response) => {
      setSession(response);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Needs to run only once

  if (!isChatbotActive) {
    router.replace('/not-found');
    return null;
  }
  if (!user || isEmpty(session)) {
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
            router.replace('/profile/chatbot-history')
          );
          return null;
        }}
      />
    </Box>
  );
};

export default ChatbotHistoryDetails;
