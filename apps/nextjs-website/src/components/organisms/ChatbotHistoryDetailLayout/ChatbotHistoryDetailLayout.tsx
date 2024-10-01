import ChatbotHistoryNavigationMenu, {
  SessionNavigationData,
} from '@/components/atoms/ChatbotHistoryNavigationMenu/ChatbotHistoryNavigationMenu';
import ChatbotHistoryMessages from '@/components/molecules/ChatbotHistoryMessages/ChatbotHistoryMessages';
import { defaultLocale } from '@/config';
import { Query } from '@/lib/chatbot/queries';
import { Delete } from '@mui/icons-material';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { isEmpty } from 'fp-ts/lib/Array';
import { useTranslations } from 'next-intl';
import React from 'react';

type DateFormatOptions = {
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
};

const DEFAULT_DATE_FORMAT = {
  locale: defaultLocale,
  options: {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  },
} satisfies DateFormatOptions;

type ChatbotHistoryDetailLayoutProps = {
  queries: Query[];
  userName: string;
  previousSession?: SessionNavigationData;
  nextSession?: SessionNavigationData;
  onDeleteChatSession: (sessionId: string) => null;
};

const ChatbotHistoryDetailLayout = ({
  queries,
  userName,
  previousSession,
  nextSession,
  onDeleteChatSession,
}: ChatbotHistoryDetailLayoutProps) => {
  const t = useTranslations();
  const { palette } = useTheme();

  if (isEmpty(queries)) {
    return (
      <Typography variant='h4'>{t('chatBot.thereAreNoMessages')}</Typography>
    );
  }

  const date = new Intl.DateTimeFormat(
    DEFAULT_DATE_FORMAT.locale,
    DEFAULT_DATE_FORMAT.options
  ).format(new Date(queries[0].queriedAt));

  return (
    <Stack direction='column' spacing={2}>
      <Typography variant='h4'>{queries[0].question}</Typography>
      <Stack direction='row' justifyContent='space-between'>
        <Typography
          component='span'
          color={palette.text.secondary}
          sx={{ fontSize: { xs: '0.75rem', xl: '1rem' } }}
        >
          {date}
        </Typography>
        <Button
          variant='outlined'
          startIcon={<Delete />}
          color='error'
          sx={{ display: { xs: 'none', xl: 'flex' } }}
          onClick={() => onDeleteChatSession(queries[0].sessionId)}
        >
          {t('chatBot.deleteChat')}
        </Button>
      </Stack>
      <ChatbotHistoryMessages queries={queries} userName={userName} />
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          justifyContent: 'center',
          paddingTop: '2rem',
          width: '100%',
        }}
      >
        <Button
          variant='outlined'
          startIcon={<Delete />}
          color='error'
          onClick={() => onDeleteChatSession(queries[0].sessionId)}
        >
          {t('chatBot.deleteChat')}
        </Button>
      </Box>
      <Box
        paddingTop='3rem'
        sx={{ display: { xs: 'none', md: 'block' }, width: '100%' }}
      >
        <ChatbotHistoryNavigationMenu
          previousSession={previousSession}
          nextSession={nextSession}
        />
      </Box>
    </Stack>
  );
};

export default ChatbotHistoryDetailLayout;
