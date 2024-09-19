'use client';

import { useTranslations } from 'next-intl';
import { Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import ChatbotHistoryLayout from '@/components/organisms/ChatbotHistoryLayout/ChatbotHistoryLayout';
import { useChatbot } from '@/helpers/chatbot.helper';
import { useUser } from '@/helpers/user.helper';
import { isChatbotActive } from '@/config';

const ChatbotHistory = () => {
  const t = useTranslations();
  const { user, loading } = useUser();
  const { paginatedSessions, getSessionsByPage } = useChatbot(true);

  useEffect(() => {
    getSessionsByPage(1);
  });

  if (!isChatbotActive) {
    return null;
  }

  if (loading || !user || !paginatedSessions) {
    return null;
  }

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
        <ChatbotHistoryLayout
          paginatedSessions={paginatedSessions}
          getSessionsByPage={getSessionsByPage}
        />
      </Stack>
    </>
  );
};

export default ChatbotHistory;
