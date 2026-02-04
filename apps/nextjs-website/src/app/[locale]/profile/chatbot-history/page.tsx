'use client';

import { useTranslations } from 'next-intl';
import { Box, Stack, Typography } from '@mui/material';
import React, { useEffect, useState, Suspense } from 'react';
import ChatbotHistoryLayout from '@/components/organisms/ChatbotHistoryLayout/ChatbotHistoryLayout';
import {
  flushChatQueriesFromLocalStorage,
  useChatbot,
} from '@/helpers/chatbot.helper';
import { useUser } from '@/helpers/user.helper';
import { isChatbotActive } from '@/config';
import Spinner from '@/components/atoms/Spinner/Spinner';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ChatbotHistoryDetailLayout from '@/components/organisms/ChatbotHistoryDetailLayout/ChatbotHistoryDetailLayout';
import { Query } from '@/lib/chatbot/queries';
import { isEmpty } from 'lodash';

const ChatbotHistoryContent = () => {
  const t = useTranslations();
  const { user, loading } = useUser();
  const {
    paginatedSessions,
    paginatedSessionsLoading,
    setIsSessionLoaded,
    isSessionLoaded,
    getSessionsByPage,
  } = useChatbot(true);
  const router = useRouter();
  const locale = useParams<{ locale: string }>().locale;

  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const { getSession, deleteChatbotSession } = useChatbot(true);
  const [session, setSession] = useState<Query[]>([]);

  useEffect(() => {
    if (sessionId) {
      setIsSessionLoaded(false);
      getSession(sessionId).then((response) => {
        setSession(response);
        setIsSessionLoaded(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]); // Needs to run only once

  useEffect(() => {
    getSessionsByPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Needs to run only once

  if (!isChatbotActive) {
    router.replace(`/${locale}/not-found`);
    return null;
  }

  if (!user) {
    return null;
  }

  if (sessionId) {
    return (
      <>
        <title>{`${t('devPortal.title')} | ${t(
          'profile.chatbot.title'
        )}`}</title>
        <Box
          sx={{
            padding: { xs: '40px 24px', md: '80px 40px' },
            width: '100%',
            maxWidth: '694px',
          }}
        >
          {!isSessionLoaded && <Spinner />}
          {isSessionLoaded && (
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
                    window.location.href = `/${locale}/profile/chatbot-history`;
                  }
                });
                return null;
              }}
            />
          )}
        </Box>
      </>
    );
  }

  return (
    <>
      <title>{`${t('devPortal.title')} | ${t('profile.chatbot.title')}`}</title>
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

const ChatbotHistory = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <ChatbotHistoryContent />
    </Suspense>
  );
};

export default ChatbotHistory;
