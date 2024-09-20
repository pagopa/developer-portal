import ChatMessage, {
  Message,
} from '@/components/atoms/ChatMessage/ChatMessage';
import { Box, Button, Paper, Stack, useTheme } from '@mui/material';
import ChatInputText from '@/components/atoms/ChatInputText/ChatInputText';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { History } from '@mui/icons-material';
import { Query } from '@/lib/chatbot/queries';
import { compact } from 'lodash';
import { useTranslations } from 'next-intl';
import { ChatCatbotWriting } from '@/components/atoms/ChatChatbotWriting/ChatChatbotWriting';
import { ChatSkeleton } from '@/components/atoms/ChatSkeleton/ChatSkeleton';
import AlertPart from '@/components/atoms/AlertPart/AlertPart';
import { ChatbotErrorsType } from '@/helpers/chatbot.helper';

type ChatProps = {
  queries: Query[];
  onSendQuery: (query: string) => null;
  onSendFeedback: (createdAt: string, hasNegativeFeedback: boolean) => null;
  scrollToBottom: boolean;
  isAwaitingResponse: boolean;
  isChatbotLoaded: boolean;
  error: ChatbotErrorsType | null;
};

const Chat = ({
  queries,
  onSendQuery,
  onSendFeedback,
  scrollToBottom,
  isAwaitingResponse,
  isChatbotLoaded,
  error,
}: ChatProps) => {
  const t = useTranslations();
  const { palette } = useTheme();
  const [instantScroll, setInstantScroll] = useState(scrollToBottom);
  const messages = useMemo(
    () => [
      firstMessage(t('chatBot.welcomeMessage')),
      ...compact(
        queries.flatMap((q) => [
          q.question && q.queriedAt
            ? {
                id: q.id,
                text: q.question,
                isQuestion: true,
                timestamp: q.queriedAt,
                hasNegativeFeedback: false,
              }
            : null,
          q.answer && q.createdAt
            ? {
                id: q.id,
                text: q.answer,
                isQuestion: false,
                timestamp: q.createdAt,
                hasNegativeFeedback: q.badAnswer || false,
              }
            : null,
        ])
      ),
    ],
    [queries, t]
  ) satisfies Message[];

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: instantScroll ? 'auto' : 'smooth',
      });
    }
    setInstantScroll(false);
  }, [queries, instantScroll, setInstantScroll]);

  return (
    <>
      <Box
        sx={{
          backgroundColor: palette.background.paper,
          borderBottom: '2px solid',
          borderBottomColor: palette.action.disabled,
          width: 'auto',
        }}
      >
        <Stack direction={'row'} paddingY={'0.25rem'}>
          <Button size='small' sx={{ margin: '0.4rem', paddingX: '0.4rem' }}>
            <History fontSize='small' />
            <span style={{ fontSize: '1rem', marginLeft: '0.5rem' }}>
              {t('chatBot.history')}
            </span>
          </Button>
        </Stack>
      </Box>
      <Stack
        direction={'column'}
        sx={{
          overflow: 'auto',
          paddingRight: '0.5rem',
          paddingX: { xs: 1, md: 4 },
          backgroundColor: palette.background.paper,
          height: '100%',
        }}
      >
        {!messages.length && !isChatbotLoaded && <ChatSkeleton />}
        {messages.map((message, index) => (
          <Stack
            key={index}
            ref={index === messages.length - 1 ? scrollRef : null}
            direction='row'
            width='100%'
            justifyContent={message.isQuestion ? 'flex-end' : 'flex-start'}
            marginTop={index === 0 ? 2 : 0}
            marginBottom={2}
          >
            <ChatMessage
              {...message}
              onToggleNegativeFeedback={(negativeFeedback) =>
                onSendFeedback(message.id, negativeFeedback)
              }
            />
          </Stack>
        ))}
        {isAwaitingResponse && <ChatCatbotWriting />}
        {error && (
          <Paper
            elevation={4}
            sx={{ marginBottom: '1rem', height: 'auto', marginTop: '1rem' }}
          >
            <AlertPart
              title={t('chatBot.errors.title')}
              text={t(`chatBot.errors.${error}`)}
              severity={'error'}
              alertStyle={{
                backgroundColor: palette.background.paper,
                marginBottom: 0,
              }}
            />
          </Paper>
        )}
      </Stack>
      <ChatInputText onSubmit={onSendQuery} sendDisabled={isAwaitingResponse} />
    </>
  );
};

export default Chat;

function firstMessage(text: string): Message {
  return {
    id: '',
    text: text,
    isQuestion: false,
    hasNegativeFeedback: false,
  };
}
