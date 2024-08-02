import ChatMessage, {
  Message,
} from '@/components/atoms/ChatMessage/ChatMessage';
import { Box, Button, Stack, useTheme } from '@mui/material';
import ChatInputText from '@/components/atoms/ChatInputText/ChatInputText';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { History, HistoryRounded } from '@mui/icons-material';
import { Query } from '@/lib/chatbot/queries';
import { compact } from 'lodash';
import { useTranslations } from 'next-intl';

type ChatProps = {
  queries: Query[];
  onSendQuery: (query: string) => null;
  sendDisabled?: boolean;
};

const Chat = ({ queries, onSendQuery, sendDisabled }: ChatProps) => {
  const t = useTranslations();
  const { palette } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
  const open = Boolean(anchorEl);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [queries]);

  const handleChatMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
        <Stack direction={'row'} paddingX={'0.75rem'} paddingY={'0.25rem'}>
          <Button size='medium'>
            <History fontSize='medium' />
            <span style={{ fontSize: '1.3rem', marginLeft: '0.65rem' }}>
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
            }}
          >
            {messages.map((message, index) => (
              <Stack
                key={index}
                ref={index === messages.length - 1 ? scrollRef : null}
                direction={'row'}
                width={'100%'}
                justifyContent={message.isQuestion ? 'flex-end' : 'flex-start'}
                marginBottom={'1rem'}
              >
                <ChatMessage {...message} />
              </Stack>
            ))}
          </Stack>
          <ChatInputText onSubmit={onSendQuery} sendDisabled={sendDisabled} />
        </Stack>
      </Box>
    </Stack>
  );
};

export default Chat;
