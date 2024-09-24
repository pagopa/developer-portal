'use client';

import { useTranslations } from 'next-intl';
import { Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import ChatbotHistoryLayout from '@/components/organisms/ChatbotHistoryLayout/ChatbotHistoryLayout';
import { useChatbot } from '@/helpers/chatbot.helper';
import { useUser } from '@/helpers/user.helper';
import { isChatbotActive } from '@/config';
import Spinner from '@/components/atoms/Spinner/Spinner';
import { useRouter } from 'next/navigation';

const ChatbotHistory = () => {
  const t = useTranslations();
  const { user, loading } = useUser();
  const { paginatedSessions, paginatedSessionsLoading, getSessionsByPage } =
    useChatbot(true);
  const router = useRouter();

  useEffect(() => {
    getSessionsByPage(1);
  }, [getSessionsByPage]);

  if (!isChatbotActive) {
    router.replace('/not-found');
    return null;
  }

  if (!user) {
    return null;
  }

  return (
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
      {!loading && !paginatedSessionsLoading && !paginatedSessions && (
        <Typography>{t('profile.chatbot.noSessions')}</Typography>
      )}
      {!loading && !paginatedSessionsLoading && paginatedSessions && (
        <ChatbotHistoryLayout
          paginatedSessions={paginatedSessions}
          getSessionsByPage={getSessionsByPage}
        />
      )}
    </Stack>
  );
};

export default ChatbotHistory;
