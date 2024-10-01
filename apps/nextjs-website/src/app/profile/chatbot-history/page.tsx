'use client';

import { useTranslations } from 'next-intl';
import { Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import ChatbotHistoryLayout from '@/components/organisms/ChatbotHistoryLayout/ChatbotHistoryLayout';
import { useChatbot } from '@/helpers/chatbot.helper';
import { useUser } from '@/helpers/user.helper';
import { defaultLocale, isChatbotActive } from '@/config';
import AlertPart from '@/components/atoms/AlertPart/AlertPart';
import Spinner from '@/components/atoms/Spinner/Spinner';
import { useRouter } from 'next/navigation';

type DateFormatOptions = {
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
};

const DEFAULT_TIMESTAMP_FORMAT = {
  locale: defaultLocale,
  options: {
    timeStyle: 'medium',
    hourCycle: 'h23',
  },
} satisfies DateFormatOptions;

const DEFAULT_DATE_FORMAT = {
  locale: defaultLocale,
  options: {
    day: '2-digit',
    month: 'numeric',
    year: 'numeric',
  },
} satisfies DateFormatOptions;

const ChatbotHistory = () => {
  const t = useTranslations();
  const { user, loading } = useUser();
  const { palette } = useTheme();
  const {
    paginatedSessions,
    getSessionsByPage,
    getDocuentationUpdatedAt,
    paginatedSessionsLoading,
  } = useChatbot(true);
  const router = useRouter();
  const documentationUpdatedAt = useMemo(getDocuentationUpdatedAt, [
    getDocuentationUpdatedAt,
  ]);

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

  if (!isChatbotActive) {
    return null;
  }

  if (loading || !user || !paginatedSessions) {
    return null;
  }

  const timestamp =
    (documentationUpdatedAt &&
      new Intl.DateTimeFormat(
        DEFAULT_TIMESTAMP_FORMAT.locale,
        DEFAULT_TIMESTAMP_FORMAT.options
      ).format(documentationUpdatedAt)) ||
    null;

  const date =
    (documentationUpdatedAt &&
      new Intl.DateTimeFormat(
        DEFAULT_DATE_FORMAT.locale,
        DEFAULT_DATE_FORMAT.options
      ).format(documentationUpdatedAt)) ||
    null;

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
        <>
          <AlertPart
            title={t('chatBot.documentationUpdatedDisclaimer.title')}
            text={t('chatBot.documentationUpdatedDisclaimer.message', {
              date: date,
              timestamp: timestamp,
            })}
            severity={'info'}
            alertStyle={{
              backgroundColor: palette.background.paper,
              marginBottom: 0,
            }}
          />
          <ChatbotHistoryLayout
            paginatedSessions={paginatedSessions}
            getSessionsByPage={getSessionsByPage}
          />
        </>
      )}
    </Stack>
  );
};

export default ChatbotHistory;
