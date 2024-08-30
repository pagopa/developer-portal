'use client';

import { useTranslations } from 'next-intl';
import { Stack, Typography } from '@mui/material';
import React from 'react';

const ChatbotHistory = () => {
  const t = useTranslations('profile.chatbot');

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
          {t('title')}
        </Typography>
      </Stack>
    </>
  );
};

export default ChatbotHistory;
