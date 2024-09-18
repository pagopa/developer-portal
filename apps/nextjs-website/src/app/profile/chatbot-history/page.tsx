'use client';

import { useTranslations } from 'next-intl';
import { Stack, Typography, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import ChatbotHistoryLayout from '@/components/organisms/ChatbotHistoryLayout/ChatbotHistoryLayout';
import { useChatbot } from '@/helpers/chatbot.helper';
import { useUser } from '@/helpers/user.helper';
import { defaultLocale, isChatbotActive } from '@/config';
import AlertPart from '@/components/atoms/AlertPart/AlertPart';

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
  const { paginatedSessions, getSessionsByPage, getDocuentationUpdatedAt } =
    useChatbot(true);

  const documentationUpdatedAt = useMemo(getDocuentationUpdatedAt, [
    getDocuentationUpdatedAt,
  ]);

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
    <>
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
      </Stack>
    </>
  );
};

export default ChatbotHistory;
