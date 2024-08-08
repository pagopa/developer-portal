import ChatMessage, {
  Message,
} from '@/components/atoms/ChatMessage/ChatMessage';
import { Box, Button, Stack, useTheme } from '@mui/material';
import ChatInputText from '@/components/atoms/ChatInputText/ChatInputText';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { History } from '@mui/icons-material';
import { Query } from '@/lib/chatbot/queries';
import { compact } from 'lodash';
import { useTranslations } from 'next-intl';
import { ChatCatbotWriting } from '@/components/atoms/ChatChatbotWriting/ChatChatbotWriting';

type ChatProps = {
  queries: Query[];
  onSendQuery: (query: string) => null;
  scrollToBottom: boolean;
  isAwaitingResponse: boolean;
};

const Chat = ({
  queries,
  onSendQuery,
  scrollToBottom,
  isAwaitingResponse,
}: ChatProps) => {
  const t = useTranslations();
  const { palette } = useTheme();
  const [instantScroll, setInstantScroll] = useState(scrollToBottom);
  const messages = useMemo(
    () =>
      compact(
        queries.flatMap((q) => [
          q.question && q.queriedAt
            ? {
                text: q.question,
                isQuestion: true,
                timestamp: q.queriedAt,
              }
            : null,
          q.answer && q.createdAt
            ? {
                text: q.answer,
                isQuestion: false,
                timestamp: q.createdAt,
              }
            : null,
        ])
      ),
    [queries]
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
    <Stack direction={'column'}>
      <Box
        sx={{
          backgroundColor: 'white',
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
      <Box
        sx={{
          backgroundColor: 'white',
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
        }}
      >
        <Stack
          direction={'column'}
          minHeight='50vh'
          maxHeight='50vh'
          justifyContent='space-between'
        >
          <Stack
            direction={'column'}
            sx={{
              overflow: 'auto',
              paddingRight: '0.5rem',
              paddingX: 4,
            }}
          >
            {messages.map((message, index) => (
              <Stack
                key={index}
                ref={index === messages.length - 1 ? scrollRef : null}
                direction={'row'}
                width={'100%'}
                justifyContent={message.isQuestion ? 'flex-end' : 'flex-start'}
                marginTop={index === 0 ? 2 : 0}
                marginBottom={2}
              >
                <ChatMessage {...message} />
              </Stack>
            ))}
            {isAwaitingResponse && <ChatCatbotWriting />}
          </Stack>
          <ChatInputText
            onSubmit={onSendQuery}
            sendDisabled={isAwaitingResponse}
          />
        </Stack>
      </Box>
    </Stack>
  );
};

export default Chat;
