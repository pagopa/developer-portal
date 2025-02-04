'use client';
import { useTranslations } from 'next-intl';
import { Box, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ChatbotHistoryLayout from '@/components/organisms/ChatbotHistoryLayout/ChatbotHistoryLayout';
import {
  flushChatQueriesFromLocalStorage,
  useChatbot,
} from '@/helpers/chatbot.helper';
import { useUser } from '@/helpers/user.helper';
import { isChatbotActive } from '@/config';
import Spinner from '@/components/atoms/Spinner/Spinner';
import { isEmpty } from 'fp-ts/lib/Array';
import { useRouter, useSearchParams } from 'next/navigation';
import ChatbotHistoryDetailLayout from '@/components/organisms/ChatbotHistoryDetailLayout/ChatbotHistoryDetailLayout';
import { Query } from '@/lib/chatbot/queries';

const ChatbotHistory = () => {
  const t = useTranslations();
  const { user, loading } = useUser();
  const { paginatedSessions, paginatedSessionsLoading, getSessionsByPage } =
    useChatbot(true);
  const router = useRouter();

  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const { getSession, deleteChatbotSession } = useChatbot(true);
  const [session, setSession] = useState<Query[]>([]);

  useEffect(() => {
    if (sessionId) {
      getSession(sessionId).then((response) => {
        setSession(response);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]); // Needs to run only once

  useEffect(() => {
    getSessionsByPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Needs to run only once

  if (!isChatbotActive) {
    router.replace('/not-found');
    return null;
  }

  if (!user) {
    return null;
  }

  if (sessionId) {
    return (
      <>
        <title>DevPortal | Chatbot History</title>
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
            onDeleteChatSession={(
              sessionId: string,
              sessionDate: string | null
            ) => {
              deleteChatbotSession(sessionId).then(() => {
                const date = sessionDate ? new Date(sessionDate) : null;
                const currentDate = new Date();
                if (date && date.getDate() === currentDate.getDate()) {
                  flushChatQueriesFromLocalStorage();
                }
                if (typeof window !== 'undefined') {
                  // router.replace() or push() are not enough because they will not clean current state of components
                  // eslint-disable-next-line functional/immutable-data
                  window.location.href = '/profile/chatbot-history';
                }
              });
              return null;
            }}
          />
        </Box>
      </>
    );
  }

  return (
    <>
      <title>DevPortal | Chatbot History</title>
      <Stack
        sx={{
          padding: { xs: '40px 24px', md: '80px 40px' },
          width: '100%',
          maxWidth: '694px',
        }}
      >
        <Typography variant='h4' sx={{ marginBottom: '40px' }}>
          {t('profile.chatbot.title')}
        </Typography>
        {(loading || paginatedSessionsLoading) && <Spinner />}
        {!loading &&
          !paginatedSessionsLoading &&
          (!paginatedSessions || isEmpty(paginatedSessions.items)) && (
            <Typography>{t('profile.chatbot.noSessions')}</Typography>
          )}
        {!loading && !paginatedSessionsLoading && paginatedSessions && (
          <ChatbotHistoryLayout
            paginatedSessions={paginatedSessions}
            getSessionsByPage={getSessionsByPage}
          />
        )}
      </Stack>
    </>
  );
};

export default ChatbotHistory;
